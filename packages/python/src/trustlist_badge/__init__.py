"""Build TrustList rank badge links: the badge image URL, the ranking it links to, the verify URL,
and a ready-to-print HTML snippet. See spec/badge.md in https://github.com/eharain/trustlist-public.

    from trustlist_badge import badge_html
    html = badge_html(type="company", slug="your-company", page="/best/web-design-agency/london")
"""

import re
from urllib.parse import quote

__all__ = ["ranking_url", "badge_url", "verify_url", "badge_html", "BadgeError"]
__version__ = "0.1.0"

_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
_SIZES = {"regular": (320, 64), "small": (240, 48)}


class BadgeError(ValueError):
    """Raised for an unknown type, a malformed slug, a page outside /best/ or an unknown size."""


def _check(type, slug, page, size):
    if type not in ("company", "product"):
        raise BadgeError('type must be "company" or "product"')
    if not slug or not _SLUG.match(slug):
        raise BadgeError("slug must be lowercase letters, digits and hyphens")
    if not page or not page.startswith("/best/"):
        raise BadgeError("page must start with /best/")
    if size not in _SIZES:
        raise BadgeError('size must be "regular" or "small"')


def _base(base):
    return (base or "https://trustlist.uk").rstrip("/")


def _enc(value):
    # The same characters as JavaScript's encodeURIComponent leaves alone.
    return quote(value, safe="-_.!~*'()")


def _query(type, slug, page, edition):
    parts = [("type", type), ("slug", slug), ("page", page)]
    if edition:
        parts.append(("edition", edition))
    return "&".join(f"{k}={_enc(v)}" for k, v in parts)


def ranking_url(type, slug, page, edition=None, base=None, size="regular"):
    """The ranking page the badge cites."""
    _check(type, slug, page, size)
    return _base(base) + page


def badge_url(type, slug, page, edition=None, base=None, size="regular"):
    """The badge image, built by TrustList from the published edition."""
    _check(type, slug, page, size)
    return f"{_base(base)}/badges/rank?{_query(type, slug, page, edition)}"


def verify_url(type, slug, page, edition=None, base=None, size="regular"):
    """TrustList's record of the rank the badge cites."""
    _check(type, slug, page, size)
    return f"{_base(base)}/badges/verify?{_query(type, slug, page, edition)}"


def _esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;").replace("'", "&#39;"))


def badge_html(type, slug, page, edition=None, base=None, size="regular", label=None):
    """The snippet to print: the badge linking to its ranking, and a small Verify link."""
    _check(type, slug, page, size)
    w, h = _SIZES[size]
    args = dict(type=type, slug=slug, page=page, edition=edition, base=base, size=size)
    return (
        f'<a href="{_esc(ranking_url(**args))}" title="See this ranking on TrustList">'
        f'<img src="{_esc(badge_url(**args))}" width="{w}" height="{h}" alt="{_esc(label or "TrustList rank badge")}" '
        f'loading="lazy" style="border:0;max-width:100%;height:auto"></a> '
        f'<a href="{_esc(verify_url(**args))}" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>'
    )
