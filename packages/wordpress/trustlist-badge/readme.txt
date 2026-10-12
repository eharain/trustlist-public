=== TrustList Badge ===
Contributors: trustlist
Tags: badge, ranking, reviews, trust, award
Requires at least: 6.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 0.1.0
License: MIT
License URI: https://opensource.org/license/mit

Show your TrustList rank badge on your site, linked to the ranking it cites.

== Description ==

If your business is ranked on [TrustList](https://trustlist.uk), this plugin shows your rank badge on
your WordPress site and links it to the ranking it comes from, so visitors can see where you stand and
why. A small Verify link under the badge opens TrustList's record of the rank.

The badge is built by TrustList from the published quarterly edition, never from anything on your site.
It updates itself when a new edition comes out, and reads "Not ranked" if the rank it cites is gone.

* A block: TrustList Badge, with its settings in the sidebar.
* A shortcode: `[trustlist_badge page="/best/web-design-agency/london" label="TrustList: Top Web Design Agencies in London"]`
* Settings > TrustList Badge: set your listing once for the whole site.

The badge is printed as plain HTML, so it works without JavaScript on the page.

== External services ==

The badge image is loaded from trustlist.uk (https://trustlist.uk/badges/rank) each time a page with the
badge is viewed, and the links point to trustlist.uk. The request sends the listing and ranking named in
the badge and the visitor's usual browser information (IP address, user agent), as any image request
does. No other data is sent. TrustList's terms: https://trustlist.uk/p/terms, privacy policy:
https://trustlist.uk/p/privacy-policy.

== Installation ==

1. Install and activate the plugin.
2. Go to Settings > TrustList Badge and enter your listing type and slug (the last part of your
   TrustList address).
3. Add the TrustList Badge block, or the shortcode, with the address of the ranking you are on.

== Frequently Asked Questions ==

= Where do I find the ranking address? =

Open the ranking on trustlist.uk and copy the part of the address that starts with /best/.

= Does it cost anything? =

No. Being listed, ranked and showing the badge are free.

== Changelog ==

= 0.1.0 =
* First release: block, shortcode and settings page.
