# TrustList.Badge

Show your TrustList rank badge on your website from .NET. If your business is ranked on
[TrustList](https://trustlist.uk), this package builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link.

```sh
dotnet add package TrustList.Badge
```

```csharp
using TrustList;

var html = Badge.Html(new BadgeOptions
{
    Type = "company",                          // or "product"
    Slug = "your-company",                     // from your TrustList address
    Page = "/best/web-design-agency/london",   // the ranking's path
    Label = "TrustList: Top Web Design Agencies in London",
});
```

`Badge.BadgeUrl`, `Badge.RankingUrl` and `Badge.VerifyUrl` return the separate links. Invalid input
throws `ArgumentException`. The badge is built by TrustList from the published edition; it updates
itself with each edition and reads "Not ranked" if the rank it cites is gone.

Same behaviour in every language: see the [specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md).
MIT licence.
