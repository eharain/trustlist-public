# trustlist/badge (PHP)

Show your TrustList rank badge on your website from PHP. If your business is ranked on
[TrustList](https://trustlist.uk), this package builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link.

```sh
composer require trustlist/badge
```

```php
use TrustList\Badge;

echo Badge::html([
    'type'  => 'company',                        // or 'product'
    'slug'  => 'your-company',                   // from your TrustList address
    'page'  => '/best/web-design-agency/london', // the ranking's path
    'label' => 'TrustList: Top Web Design Agencies in London',
]);
```

`Badge::badgeUrl`, `Badge::rankingUrl` and `Badge::verifyUrl` return the separate links; invalid input
throws `InvalidArgumentException`. Works on PHP 7.4 and later, with no dependencies. For WordPress, a
plugin built on this is on the way.

The badge is built by TrustList from the published edition; it updates itself with each edition and
reads "Not ranked" if the rank it cites is gone. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
