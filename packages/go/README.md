# TrustList badge for Go

Show your TrustList rank badge on your website from Go. If your business is ranked on
[TrustList](https://trustlist.uk), this package builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link.

```sh
go get github.com/eharain/trustlist-public/packages/go
```

```go
import badge "github.com/eharain/trustlist-public/packages/go"

html, err := badge.HTML(badge.Options{
	Type:  "company",                        // or "product"
	Slug:  "your-company",                   // from your TrustList address
	Page:  "/best/web-design-agency/london", // the ranking's path
	Label: "TrustList: Top Web Design Agencies in London",
})
```

`BadgeURL`, `RankingURL` and `VerifyURL` return the separate links. Use `template.HTML(html)` when
printing through `html/template`. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
