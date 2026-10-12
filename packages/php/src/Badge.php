<?php

declare(strict_types=1);

namespace TrustList;

/**
 * Builds TrustList rank badge links: the badge image URL, the ranking it links to, the verify URL,
 * and a ready-to-print HTML snippet. See spec/badge.md in https://github.com/eharain/trustlist-public.
 *
 *   echo \TrustList\Badge::html(['type' => 'company', 'slug' => 'your-company', 'page' => '/best/web-design-agency/london']);
 *
 * Options: type ("company" or "product"), slug, page (starts with /best/), and optionally edition,
 * base (default https://trustlist.uk), size ("regular" or "small") and label.
 */
final class Badge
{
    private const SIZES = ['regular' => [320, 64], 'small' => [240, 48]];

    /** The ranking page the badge cites. */
    public static function rankingUrl(array $o): string
    {
        self::check($o);
        return self::base($o) . $o['page'];
    }

    /** The badge image, built by TrustList from the published edition. */
    public static function badgeUrl(array $o): string
    {
        self::check($o);
        return self::base($o) . '/badges/rank?' . self::query($o);
    }

    /** TrustList's record of the rank the badge cites. */
    public static function verifyUrl(array $o): string
    {
        self::check($o);
        return self::base($o) . '/badges/verify?' . self::query($o);
    }

    /** The snippet to print: the badge linking to its ranking, and a small Verify link. */
    public static function html(array $o): string
    {
        self::check($o);
        [$w, $h] = self::SIZES[$o['size'] ?? 'regular'];
        $label = ($o['label'] ?? '') !== '' ? $o['label'] : 'TrustList rank badge';
        return '<a href="' . self::esc(self::rankingUrl($o)) . '" title="See this ranking on TrustList"><img src="'
            . self::esc(self::badgeUrl($o)) . '" width="' . $w . '" height="' . $h . '" alt="' . self::esc($label)
            . '" loading="lazy" style="border:0;max-width:100%;height:auto"></a> <a href="' . self::esc(self::verifyUrl($o))
            . '" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>';
    }

    private static function check(array $o): void
    {
        $type = $o['type'] ?? null;
        if ($type !== 'company' && $type !== 'product') {
            throw new \InvalidArgumentException('type must be "company" or "product"');
        }
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', (string) ($o['slug'] ?? ''))) {
            throw new \InvalidArgumentException('slug must be lowercase letters, digits and hyphens');
        }
        if (strpos((string) ($o['page'] ?? ''), '/best/') !== 0) {
            throw new \InvalidArgumentException('page must start with /best/');
        }
        if (!isset(self::SIZES[$o['size'] ?? 'regular'])) {
            throw new \InvalidArgumentException('size must be "regular" or "small"');
        }
    }

    private static function base(array $o): string
    {
        return rtrim(($o['base'] ?? '') !== '' ? $o['base'] : 'https://trustlist.uk', '/');
    }

    /** Matches JavaScript's encodeURIComponent. */
    private static function enc(string $s): string
    {
        return strtr(rawurlencode($s), ['%21' => '!', '%2A' => '*', '%27' => "'", '%28' => '(', '%29' => ')']);
    }

    private static function query(array $o): string
    {
        $q = 'type=' . self::enc($o['type']) . '&slug=' . self::enc($o['slug']) . '&page=' . self::enc($o['page']);
        if (($o['edition'] ?? '') !== '') {
            $q .= '&edition=' . self::enc($o['edition']);
        }
        return $q;
    }

    private static function esc(string $s): string
    {
        // Exactly the five replacements in the specification (htmlspecialchars would write &apos; or &#039;).
        return strtr($s, ['&' => '&amp;', '<' => '&lt;', '>' => '&gt;', '"' => '&quot;', "'" => '&#39;']);
    }
}
