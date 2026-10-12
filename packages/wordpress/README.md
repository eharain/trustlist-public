# TrustList Badge for WordPress

A WordPress plugin that shows a business's TrustList rank badge, linked to the ranking it cites. It
adds a block (TrustList Badge), a shortcode (`[trustlist_badge page="/best/..."]`) and a settings page
where the listing is set once for the whole site. The badge is printed as plain HTML, so it works
without JavaScript on the page.

The plugin lives in [`trustlist-badge/`](trustlist-badge); its [readme.txt](trustlist-badge/readme.txt)
is the wordpress.org listing. Tested on WordPress 7.1.3 with PHP 8.4. It uses the same badge code as the
[PHP package](../php) and follows the shared [specification](../../spec/badge.md). MIT licence.
