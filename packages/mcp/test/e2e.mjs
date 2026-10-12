// End-to-end test: a mock TrustList API on localhost, the real MCP server over stdio, and an MCP
// client calling each tool. Exit code 0 when every check passes.
import http from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SRC = "https://trustlist.uk";
const routes = {
  "/api/v1/search?q=inventory": { query: "inventory", did_you_mean: null, groups: [{ kind: "ranking", label: "Rankings", results: [{ title: "Top Inventory Management Software", url: `${SRC}/top/inventory-management-software`, kind: "ranking", subtitle: "726 listed", listings: 726 }] }], source_url: `${SRC}/search?q=inventory`, attribution: "TrustList (trustlist.uk)" },
  "/api/v1/ranking?path=%2Ftop%2Finventory-management-software": { kind: "topic", url: `${SRC}/top/inventory-management-software`, heading: "Top Inventory Management Software", description: "Inventory tools compared.", total: 726, sections: [{ name: "Inventory Management Software", total: 400 }], top: [{ rank: 1, name: "Acme Stock", url: `${SRC}/inventory-management-software/acme-stock`, rating: 4.5, reviews: 12 }], source_url: `${SRC}/top/inventory-management-software`, attribution: "TrustList (trustlist.uk)" },
  "/api/v1/badges/company/acme-ltd": { listing: { name: "Acme Ltd", url: `${SRC}/web-design-agency/acme-ltd` }, edition: "2026-Q4", badges: [{ rank: 2, rank_label: "2", ranking: "Top Web Design Agencies in London", ranking_url: `${SRC}/best/web-design-agency/london`, badge_html: "<a></a>" }], source_url: `${SRC}/badges/company/acme-ltd`, attribution: "TrustList (trustlist.uk)" },
};
const server = http.createServer((req, res) => {
  const body = routes[req.url];
  res.writeHead(body ? 200 : 404, { "content-type": "application/json" });
  res.end(JSON.stringify(body || { error: "no such ranking" }));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const transport = new StdioClientTransport({ command: process.execPath, args: [new URL("../src/index.js", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")], env: { ...process.env, TRUSTLIST_BASE: base } });
const client = new Client({ name: "e2e", version: "0.0.0" });
await client.connect(transport);

let failed = 0;
const check = (name, cond) => { console.log(`${cond ? "ok  " : "FAIL"} ${name}`); if (!cond) failed++; };
const call = async (name, args) => (await client.callTool({ name, arguments: args }));

const tools = (await client.listTools()).tools.map((t) => t.name).sort();
check("lists three tools", JSON.stringify(tools) === JSON.stringify(["get_listing_badges", "get_ranking", "search_trustlist"]));
const s = await call("search_trustlist", { query: "inventory" });
check("search names the ranking and cites TrustList", /Top Inventory Management Software \(726 listed\): https:\/\/trustlist\.uk\/top\/inventory-management-software/.test(s.content[0].text) && /Source: TrustList/.test(s.content[0].text));
const r = await call("get_ranking", { path: "/top/inventory-management-software" });
check("ranking lists the top with links", /1\. Acme Stock \(4\.5 from 12 reviews\): https:\/\/trustlist\.uk/.test(r.content[0].text));
const b = await call("get_listing_badges", { type: "company", slug: "acme-ltd" });
check("badges list the rank and ranking", /#2 in Top Web Design Agencies in London/.test(b.content[0].text));
const e = await call("get_ranking", { path: "/best/nothing/here" });
check("unknown ranking is an error, not a crash", e.isError === true && /no such ranking/.test(e.content[0].text));

await client.close();
server.close();
console.log(failed ? `${failed} failed` : "all passed");
process.exit(failed ? 1 : 0);
