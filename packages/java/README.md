# trustlist-badge (Java)

Show your TrustList rank badge on your website from Java (8 and later). If your business is ranked on
[TrustList](https://trustlist.uk), this library builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link. No dependencies.

```xml
<dependency>
  <groupId>uk.trustlist</groupId>
  <artifactId>trustlist-badge</artifactId>
  <version>0.1.0</version>
</dependency>
```

```java
import uk.trustlist.badge.Badge;

Badge.Options o = new Badge.Options("company", "your-company", "/best/web-design-agency/london");
o.label = "TrustList: Top Web Design Agencies in London";
String html = Badge.html(o); // escapes every value itself
```

`Badge.badgeUrl`, `Badge.rankingUrl` and `Badge.verifyUrl` return the separate links; invalid input
throws `IllegalArgumentException`.

The badge is built by TrustList from the published edition; it updates itself with each edition and
reads "Not ranked" if the rank it cites is gone. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
