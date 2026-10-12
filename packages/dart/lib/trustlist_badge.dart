/// Build TrustList rank badge links: the badge image URL, the ranking it links to, the verify URL,
/// and a ready-to-print HTML snippet. See spec/badge.md in
/// https://github.com/eharain/trustlist-public.
///
/// ```dart
/// final html = badgeHtml(const BadgeOptions(type: 'company', slug: 'your-company', page: '/best/web-design-agency/london'));
/// ```
library trustlist_badge;

/// Options for one badge. [type], [slug] and [page] are required.
class BadgeOptions {
  /// "company" or "product".
  final String type;

  /// The listing's slug, as in its TrustList address.
  final String slug;

  /// The ranking's path, starting with /best/.
  final String page;

  /// Optional edition, e.g. "2026-Q4".
  final String? edition;

  /// Optional TrustList address; default https://trustlist.uk.
  final String? base;

  /// "regular" (default) or "small".
  final String size;

  /// Optional link text and image alt text.
  final String? label;

  const BadgeOptions({required this.type, required this.slug, required this.page, this.edition, this.base, this.size = 'regular', this.label});
}

/// Invalid input: an unknown type, a malformed slug, a page outside /best/ or an unknown size.
class BadgeError extends ArgumentError {
  BadgeError(String message) : super(message);
}

const _sizes = {'regular': [320, 64], 'small': [240, 48]};
final _slug = RegExp(r'^[a-z0-9]+(?:-[a-z0-9]+)*$');

void _check(BadgeOptions o) {
  if (o.type != 'company' && o.type != 'product') throw BadgeError('type must be "company" or "product"');
  if (!_slug.hasMatch(o.slug)) throw BadgeError('slug must be lowercase letters, digits and hyphens');
  if (!o.page.startsWith('/best/')) throw BadgeError('page must start with /best/');
  if (!_sizes.containsKey(o.size)) throw BadgeError('size must be "regular" or "small"');
}

String _base(BadgeOptions o) => ((o.base == null || o.base!.isEmpty) ? 'https://trustlist.uk' : o.base!).replaceAll(RegExp(r'/+$'), '');

/// Matches JavaScript's encodeURIComponent (Dart's encoder also leaves ! * ' ( ) alone).
String _enc(String s) => Uri.encodeComponent(s);

String _query(BadgeOptions o) {
  final parts = ['type=${_enc(o.type)}', 'slug=${_enc(o.slug)}', 'page=${_enc(o.page)}'];
  if (o.edition != null && o.edition!.isNotEmpty) parts.add('edition=${_enc(o.edition!)}');
  return parts.join('&');
}

String _esc(String s) =>
    s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

/// The ranking page the badge cites.
String rankingUrl(BadgeOptions o) {
  _check(o);
  return _base(o) + o.page;
}

/// The badge image, built by TrustList from the published edition.
String badgeUrl(BadgeOptions o) {
  _check(o);
  return '${_base(o)}/badges/rank?${_query(o)}';
}

/// TrustList's record of the rank the badge cites.
String verifyUrl(BadgeOptions o) {
  _check(o);
  return '${_base(o)}/badges/verify?${_query(o)}';
}

/// The snippet to print: the badge linking to its ranking, and a small Verify link.
String badgeHtml(BadgeOptions o) {
  _check(o);
  final wh = _sizes[o.size]!;
  final label = (o.label == null || o.label!.isEmpty) ? 'TrustList rank badge' : o.label!;
  return '<a href="${_esc(rankingUrl(o))}" title="See this ranking on TrustList"><img src="${_esc(badgeUrl(o))}" '
      'width="${wh[0]}" height="${wh[1]}" alt="${_esc(label)}" loading="lazy" style="border:0;max-width:100%;height:auto"></a> '
      '<a href="${_esc(verifyUrl(o))}" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>';
}
