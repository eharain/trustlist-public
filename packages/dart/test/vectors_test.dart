import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';
import 'package:trustlist_badge/trustlist_badge.dart';

BadgeOptions opts(Map<String, dynamic> i) => BadgeOptions(
      type: i['type'] as String? ?? '',
      slug: i['slug'] as String? ?? '',
      page: i['page'] as String? ?? '',
      edition: i['edition'] as String?,
      base: i['base'] as String?,
      size: i['size'] as String? ?? 'regular',
      label: i['label'] as String?,
    );

void main() {
  final v = jsonDecode(File('test/badge-vectors.json').readAsStringSync()) as Map<String, dynamic>;

  test('valid vectors', () {
    for (final c in v['valid'] as List) {
      final o = opts((c as Map<String, dynamic>)['input'] as Map<String, dynamic>);
      expect(rankingUrl(o), c['rankingUrl']);
      expect(badgeUrl(o), c['badgeUrl']);
      expect(verifyUrl(o), c['verifyUrl']);
      expect(badgeHtml(o), c['badgeHtml']);
    }
  });

  test('invalid vectors', () {
    for (final c in v['invalid'] as List) {
      final o = opts((c as Map<String, dynamic>)['input'] as Map<String, dynamic>);
      expect(() => badgeHtml(o), throwsA(isA<BadgeError>()));
    }
  });
}
