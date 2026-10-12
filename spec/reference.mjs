// Reference implementation of spec/badge.md. `node spec/reference.mjs` rewrites badge-vectors.json.
import { writeFileSync } from 'node:fs';

const SIZES = { regular: [320, 64], small: [240, 48] };
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function check({ type, slug, page, size = 'regular' }) {
  if (type !== 'company' && type !== 'product') throw new Error('type must be "company" or "product"');
  if (!slug || !SLUG.test(slug)) throw new Error('slug must be lowercase letters, digits and hyphens');
  if (!page || !page.startsWith('/best/')) throw new Error('page must start with /best/');
  if (!SIZES[size]) throw new Error('size must be "regular" or "small"');
}

const base = (b) => (b || 'https://trustlist.uk').replace(/\/+$/, '');
const query = ({ type, slug, page, edition }) =>
  [['type', type], ['slug', slug], ['page', page], ...(edition ? [['edition', edition]] : [])]
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const rankingUrl = (o) => { check(o); return base(o.base) + o.page; };
export const badgeUrl = (o) => { check(o); return `${base(o.base)}/badges/rank?${query(o)}`; };
export const verifyUrl = (o) => { check(o); return `${base(o.base)}/badges/verify?${query(o)}`; };
export function badgeHtml(o) {
  check(o);
  const [w, h] = SIZES[o.size || 'regular'];
  const label = o.label || 'TrustList rank badge';
  return `<a href="${esc(rankingUrl(o))}" title="See this ranking on TrustList"><img src="${esc(badgeUrl(o))}" width="${w}" height="${h}" alt="${esc(label)}" loading="lazy" style="border:0;max-width:100%;height:auto"></a> <a href="${esc(verifyUrl(o))}" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>`;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/').replace(/^\//, '')}` || process.argv[1]?.endsWith('reference.mjs')) {
  const valid = [
    { type: 'company', slug: 'acme-ltd', page: '/best/web-design-agency/london' },
    { type: 'product', slug: 'postgresql', page: '/best/rdbms-software/sql', edition: '2026-Q4' },
    { type: 'company', slug: 'acme-ltd', page: '/best/accounting-firm/united-kingdom', size: 'small', base: 'https://example.test/', label: 'Top Accounting Firms in the UK & "more" <test>' },
  ];
  const invalid = [
    { type: 'person', slug: 'acme-ltd', page: '/best/x' },
    { type: 'company', slug: 'Acme Ltd', page: '/best/x' },
    { type: 'company', slug: '', page: '/best/x' },
    { type: 'company', slug: 'acme-ltd', page: '/top/x' },
    { type: 'company', slug: 'acme-ltd', page: '/best/x', size: 'huge' },
  ];
  const vectors = {
    valid: valid.map((input) => ({ input, rankingUrl: rankingUrl(input), badgeUrl: badgeUrl(input), verifyUrl: verifyUrl(input), badgeHtml: badgeHtml(input) })),
    invalid: invalid.map((input) => ({ input })),
  };
  writeFileSync(new URL('./badge-vectors.json', import.meta.url), `${JSON.stringify(vectors, null, 2)}\n`);
  console.log(`wrote ${vectors.valid.length} valid and ${vectors.invalid.length} invalid vectors`);
}
