# trustlist-badge

Show your TrustList rank badge on your website from Python. If your business is ranked on
[TrustList](https://trustlist.uk), this package builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link.

```sh
pip install trustlist-badge
```

```python
from trustlist_badge import badge_html

html = badge_html(
    type="company",                          # or "product"
    slug="your-company",                     # from your TrustList address
    page="/best/web-design-agency/london",   # the ranking's path
    label="TrustList: Top Web Design Agencies in London",
)
```

In Django or Jinja templates, mark it safe (`mark_safe(html)` or `{{ html|safe }}`): the function
escapes every value itself. `badge_url`, `ranking_url` and `verify_url` return the separate links;
invalid input raises `BadgeError`.

The badge is built by TrustList from the published edition; it updates itself with each edition and
reads "Not ranked" if the rank it cites is gone. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
