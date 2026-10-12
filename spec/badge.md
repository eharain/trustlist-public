# Badge helper specification

Every language package in this repository implements the same four functions, so a badge looks and
links the same wherever it is printed. The shared test file [`badge-vectors.json`](badge-vectors.json)
holds inputs and the exact expected outputs; each package's tests read it.

## Inputs

| Name | Required | Rule |
|---|---|---|
| `type` | yes | `company` or `product` |
| `slug` | yes | the listing's slug: lowercase letters, digits and hyphens |
| `page` | yes | the ranking's path, starting with `/best/` |
| `edition` | no | e.g. `2026-Q4`; omitted means the latest edition that has the page |
| `base` | no | TrustList's address, default `https://trustlist.uk`, trailing slashes removed |
| `size` | no | `regular` (320 x 64, default) or `small` (240 x 48) |
| `label` | no | the link text and image alt text; default `TrustList rank badge` |

Invalid input (an unknown type, an empty or malformed slug, a page not starting with `/best/`) is an
error in the language's usual way: an exception, an error value or a `Result`.

## Outputs

1. `rankingUrl` = `base + page`.
2. `badgeUrl` = `base + "/badges/rank?" + query`, where `query` is `type`, `slug`, `page` and, if given,
   `edition`, in that order, each as `name=value` joined by `&`, values percent-encoded as in
   `encodeURIComponent` (so `/` becomes `%2F`).
3. `verifyUrl` = `base + "/badges/verify?" + query` (the same query).
4. `badgeHtml` = exactly:

```
<a href="{rankingUrl}" title="See this ranking on TrustList"><img src="{badgeUrl}" width="{w}" height="{h}" alt="{label}" loading="lazy" style="border:0;max-width:100%;height:auto"></a> <a href="{verifyUrl}" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>
```

with every `{value}` HTML-escaped: `&` to `&amp;`, `<` to `&lt;`, `>` to `&gt;`, `"` to `&quot;`,
`'` to `&#39;`.

The first link is the one that matters: it points at the ranking the badge cites, in plain HTML that
search engines and readers without JavaScript see.
