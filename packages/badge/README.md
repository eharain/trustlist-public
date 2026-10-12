# @trustlist/badge

Show your TrustList rank badge on your website. If your business is ranked on
[TrustList](https://trustlist.uk), this small web component displays the badge for that ranking and
links to the ranking itself, so visitors can see where you stand and why.

The badge is built by TrustList from the published edition, never from anything on your site. When a
new edition comes out, it updates itself; if the rank it cites is gone, it reads "Not ranked".

## Use it

Paste this where the badge should appear, with your own values:

```html
<trustlist-badge type="company" slug="your-company" page="/best/web-design-agency/london">
  <a href="https://trustlist.uk/best/web-design-agency/london">TrustList: Top Web Design Agencies in London</a>
</trustlist-badge>
<script type="module" src="https://cdn.jsdelivr.net/npm/@trustlist/badge/src/trustlist-badge.js"></script>
```

- `slug` is the last part of your TrustList address: for `https://trustlist.uk/web-design-agency/your-company`
  it is `your-company`. Use `type="product"` for a software product.
- `page` is the ranking's address on TrustList, starting with `/best/`.
- The link inside the element is shown if scripts are off, and is what search engines read. Keep it.

With a bundler:

```sh
npm install @trustlist/badge
```

```js
import '@trustlist/badge';
```

## Attributes

| Attribute | Required | Meaning |
|---|---|---|
| `type` | yes | `company` or `product` |
| `slug` | yes | your listing's slug |
| `page` | yes | the ranking's path, e.g. `/best/web-design-agency/london` |
| `edition` | no | a past edition, e.g. `2026-Q4`; default is the latest |
| `size` | no | `small` (240 px wide) or `regular` (320 px, default) |

Anyone can check a badge: the small "Verify" link under it opens TrustList's record of that rank.

## Licence

MIT. See [LICENSE](./LICENSE).
