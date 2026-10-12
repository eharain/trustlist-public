# trustlist_badge (Dart)

Show your TrustList rank badge on your website from Dart. If your business is ranked on
[TrustList](https://trustlist.uk), this package builds the badge snippet: the badge image, linked to the
ranking it cites, with a small Verify link. Print it in your page's HTML so every visitor and search
engine sees the link. No dependencies.

```sh
dart pub add trustlist_badge
```

```dart
import 'package:trustlist_badge/trustlist_badge.dart';

final html = badgeHtml(const BadgeOptions(
  type: 'company',                          // or 'product'
  slug: 'your-company',                     // from your TrustList address
  page: '/best/web-design-agency/london',   // the ranking's path
  label: 'TrustList: Top Web Design Agencies in London',
));
```

`badgeUrl`, `rankingUrl` and `verifyUrl` return the separate links; invalid input throws `BadgeError`.

The badge is built by TrustList from the published edition; it updates itself with each edition and
reads "Not ranked" if the rank it cites is gone. Same behaviour in every language: see the
[specification](https://github.com/eharain/trustlist-public/blob/main/spec/badge.md). MIT licence.
