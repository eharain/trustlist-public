# @trustlist/mcp

An MCP server that lets AI assistants look up [TrustList](https://trustlist.uk): its rankings of
software, IT services and B2B firms by category and country. Read-only, no key, no sign-in. Every
answer names the TrustList page it comes from, so the assistant can cite it.

## Tools

| Tool | What it does |
|---|---|
| `search_trustlist` | Finds rankings, companies, products and articles for a query, e.g. "inventory management software" |
| `get_ranking` | A ranking's description, size and current top 15 with links, e.g. `/top/crm-software` |
| `get_listing_badges` | Where a company or product is ranked in the current edition |

## Set up

Any assistant that runs MCP servers from a config file:

```json
{
  "mcpServers": {
    "trustlist": { "command": "npx", "args": ["-y", "@trustlist/mcp"] }
  }
}
```

- Claude Desktop: add it to `claude_desktop_config.json`.
- Claude Code: `claude mcp add trustlist -- npx -y @trustlist/mcp`
- Cursor, Windsurf and other MCP clients: the same command in their MCP settings.

Requires Node 18 or later. The data comes from TrustList's public API at
`https://trustlist.uk/api/v1` (documented at [trustlist.uk/developers](https://trustlist.uk/developers)).

## How rankings work

Ranks come from evidence TrustList checks and are published as quarterly editions; see
[how TrustList ranks](https://trustlist.uk/best/methodology). MIT licence.
