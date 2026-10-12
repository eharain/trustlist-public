# trustlist-badge (Rust)

Show your TrustList rank badge on your website from Rust. If your business is ranked on
[TrustList](https://trustlist.uk), this crate builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link. No dependencies.

```sh
cargo add trustlist-badge
```

```rust
use trustlist_badge::{html, Options};

let mut o = Options::new("company", "your-company", "/best/web-design-agency/london");
o.label = Some("TrustList: Top Web Design Agencies in London".into());
let snippet = html(&o)?; // escapes every value itself
```

`badge_url`, `ranking_url` and `verify_url` return the separate links; invalid input returns a
`BadgeError`.

The badge is built by TrustList from the published edition; it updates itself with each edition and
reads "Not ranked" if the rank it cites is gone. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
