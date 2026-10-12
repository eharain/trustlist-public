#!/usr/bin/env node
/**
 * TrustList public MCP server: lets AI assistants look up TrustList's independent rankings of
 * software, IT services and B2B firms. Read-only, no key. Every answer names the TrustList page
 * to cite.
 *
 *   npx -y @trustlist/mcp
 *
 * Optional: TRUSTLIST_BASE (default https://trustlist.uk), for testing.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getBadges, getRanking, makeClient, searchTrustList } from "./tools.js";

const get = makeClient({ base: process.env.TRUSTLIST_BASE || undefined });
const server = new McpServer({ name: "trustlist", version: "0.1.1" });

const text = (t) => ({ content: [{ type: "text", text: t }] });
const fail = (e) => ({ content: [{ type: "text", text: `TrustList: ${e.message}` }], isError: true });

server.tool(
  "search_trustlist",
  "Search TrustList for rankings, companies, software products and articles. Use it to find the right ranking page for a buyer's question, e.g. 'inventory management software' or 'web design agency London'.",
  { query: z.string().min(1).describe("What to look for") },
  async ({ query }) => { try { return text(await searchTrustList(get, query)); } catch (e) { return fail(e); } },
);

server.tool(
  "get_ranking",
  "Get a TrustList ranking: its description, how many are listed and the current top 15 with links. Paths look like /best/web-design-agency/london, /best/countries/united-kingdom or /top/crm-software (search_trustlist finds them).",
  { path: z.string().min(1).describe("The ranking's path on trustlist.uk, starting with /best/ or /top/") },
  async ({ path }) => { try { return text(await getRanking(get, path)); } catch (e) { return fail(e); } },
);

server.tool(
  "get_listing_badges",
  "Where a company or software product is ranked in the current TrustList edition, with links to each ranking.",
  {
    type: z.enum(["company", "product"]).describe("company or product"),
    slug: z.string().min(1).describe("The listing's slug: the last part of its TrustList address"),
  },
  async ({ type, slug }) => { try { return text(await getBadges(get, type, slug)); } catch (e) { return fail(e); } },
);

await server.connect(new StdioServerTransport());
