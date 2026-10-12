/**
 * <trustlist-badge> : shows a business's TrustList rank badge and links to the ranking it cites.
 *
 *   <trustlist-badge type="company" slug="your-company" page="/best/web-design-agency/london">
 *     <a href="https://trustlist.uk/best/web-design-agency/london">TrustList: Top Web Design Agencies in London</a>
 *   </trustlist-badge>
 *   <script type="module" src="https://cdn.jsdelivr.net/npm/@trustlist/badge/src/trustlist-badge.js"></script>
 *
 * The link inside the element is the fallback: it is in the page's HTML, so it works without
 * JavaScript and for crawlers. The script swaps its text for the badge image, which TrustList
 * builds from the published edition (it reads "Not ranked" once the rank it cites is gone).
 *
 * Attributes
 *   type     "company" or "product"
 *   slug     the listing's slug, as in its TrustList address
 *   page     the ranking's path, e.g. /best/web-design-agency/london
 *   edition  optional, e.g. 2026-Q4 (default: the latest edition that has the page)
 *   size     optional: "small" (240 wide) or "regular" (320 wide, the default)
 *   base     optional: TrustList's address (default https://trustlist.uk), for testing
 */

const DEFAULT_BASE = 'https://trustlist.uk';
const SIZES = { small: [240, 48], regular: [320, 64] };

export class TrustListBadge extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'slug', 'page', 'edition', 'size', 'base'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  get base() {
    return (this.getAttribute('base') || DEFAULT_BASE).replace(/\/+$/, '');
  }

  render() {
    const type = this.getAttribute('type') || 'company';
    const slug = this.getAttribute('slug');
    const page = this.getAttribute('page');
    if (!slug || !page || !page.startsWith('/')) return; // keep whatever fallback the page already has
    const edition = this.getAttribute('edition');
    const [width, height] = SIZES[this.getAttribute('size')] || SIZES.regular;
    // The fallback link's text names the ranking; keep it from before the first render.
    if (this._label === undefined) this._label = this.textContent.replace(/\s+/g, ' ').trim();

    const params = new URLSearchParams({ type, slug, page });
    if (edition) params.set('edition', edition);

    const link = document.createElement('a');
    link.href = `${this.base}${page}`;
    link.rel = 'noopener';
    link.title = 'See this ranking on TrustList';

    const img = document.createElement('img');
    img.src = `${this.base}/badges/rank?${params}`;
    img.width = width;
    img.height = height;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = this._label || 'TrustList rank badge';
    img.style.border = '0';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    link.append(img);

    const verify = document.createElement('a');
    verify.href = `${this.base}/badges/verify?${params}`;
    verify.textContent = 'Verify';
    verify.style.cssText = 'display:block;font:11px/1.6 system-ui,sans-serif;color:#64748b';

    this.replaceChildren(link, verify);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('trustlist-badge')) {
  customElements.define('trustlist-badge', TrustListBadge);
}
