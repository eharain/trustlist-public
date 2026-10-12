# trustlist-badge (Ruby)

Show your TrustList rank badge on your website from Ruby. If your business is ranked on
[TrustList](https://trustlist.uk), this gem builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link.

```sh
gem install trustlist-badge
```

```ruby
require "trustlist_badge"

html = TrustListBadge.html(
  type: "company",                          # or "product"
  slug: "your-company",                     # from your TrustList address
  page: "/best/web-design-agency/london",   # the ranking's path
  label: "TrustList: Top Web Design Agencies in London"
)
```

In Rails views use `html.html_safe` (the gem escapes every value itself). `badge_url`, `ranking_url` and
`verify_url` return the separate links; invalid input raises `TrustListBadge::Error`.

The badge is built by TrustList from the published edition; it updates itself with each edition and
reads "Not ranked" if the rank it cites is gone. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
