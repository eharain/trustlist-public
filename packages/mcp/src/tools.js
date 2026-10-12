/**
 * The tools of the public TrustList MCP server, as plain functions over the public data API
 * (https://trustlist.uk/api/v1). Each returns text an assistant can quote, ending with the
 * TrustList page to cite. No key, no personal data.
 */

export const DEFAULT_BASE = "https://trustlist.uk";

export function makeClient({ base = DEFAULT_BASE, fetchImpl = globalThis.fetch } = {}) {
  const root = base.replace(/\/+$/, "");
  return async function get(path) {
    const res = await fetchImpl(`${root}/api/v1${path}`, { headers: { accept: "application/json", "user-agent": "trustlist-mcp/0.1" } });
    let data = null;
    try { data = await res.json(); } catch { /* not JSON */ }
    if (!res.ok) throw new Error((data && data.error) || `TrustList answered ${res.status}`);
    return data;
  };
}

const cite = (d) => `Source: ${d.attribution || "TrustList"}, ${d.source_url}`;

export async function searchTrustList(get, query) {
  const d = await get(`/search?q=${encodeURIComponent(query)}`);
  if (!d.groups || !d.groups.length) {
    return `No TrustList pages matched "${query}".${d.did_you_mean ? ` Did you mean "${d.did_you_mean}"?` : ""}`;
  }
  const lines = [`TrustList results for "${d.query}":`];
  for (const g of d.groups) {
    lines.push("", `${g.label}:`);
    for (const r of g.results) lines.push(`- ${r.title}${r.subtitle ? ` (${r.subtitle})` : ""}: ${r.url}`);
  }
  lines.push("", cite(d));
  return lines.join("\n");
}

export async function getRanking(get, path) {
  const d = await get(`/ranking?path=${encodeURIComponent(path)}`);
  const lines = [d.heading, d.description, `${d.total} listed. Full ranking: ${d.url}`, ""];
  if (d.top && d.top.length) {
    lines.push("Current top of the ranking:");
    for (const i of d.top) {
      const extra = i.reviews ? ` (${i.rating} from ${i.reviews} reviews)` : "";
      lines.push(`${i.rank != null ? `${i.rank}. ` : "- "}${i.name}${extra}: ${i.url}`);
    }
  }
  if (d.sections && d.sections.length) lines.push("", `Sections: ${d.sections.map((s) => `${s.name} (${s.total})`).join(", ")}`);
  lines.push("", "Ranks come from evidence TrustList checks and are published as quarterly editions: https://trustlist.uk/best/methodology", cite(d));
  return lines.join("\n");
}

export async function getBadges(get, type, slug) {
  const d = await get(`/badges/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`);
  if (!d.badges || !d.badges.length) {
    return `${d.listing.name} has no rank in the current TrustList edition.${d.listing.url ? ` Listing: ${d.listing.url}` : ""}\n${cite(d)}`;
  }
  const lines = [`${d.listing.name} in the ${d.edition} edition of TrustList:`];
  for (const b of d.badges) lines.push(`- ${b.rank_label.startsWith("=") ? "joint " : ""}#${b.rank} in ${b.ranking}: ${b.ranking_url}`);
  lines.push("", "Badge code for a website (one per ranking) is on the badges page below.", cite(d));
  return lines.join("\n");
}
