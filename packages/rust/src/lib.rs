//! Build TrustList rank badge links: the badge image URL, the ranking it links to, the verify URL,
//! and a ready-to-print HTML snippet. See `spec/badge.md` in
//! <https://github.com/eharain/trustlist-public>.
//!
//! ```
//! use trustlist_badge::{html, Options};
//! let snippet = html(&Options::new("company", "your-company", "/best/web-design-agency/london")).unwrap();
//! assert!(snippet.starts_with("<a href=\"https://trustlist.uk/best/web-design-agency/london\""));
//! ```

use std::fmt;

/// Options for one badge. `kind`, `slug` and `page` are required.
#[derive(Clone, Debug, Default)]
pub struct Options {
    /// "company" or "product".
    pub kind: String,
    /// The listing's slug, as in its TrustList address.
    pub slug: String,
    /// The ranking's path, starting with /best/.
    pub page: String,
    /// Optional edition, e.g. "2026-Q4".
    pub edition: Option<String>,
    /// Optional TrustList address; default <https://trustlist.uk>.
    pub base: Option<String>,
    /// "regular" (default) or "small".
    pub size: Option<String>,
    /// Optional link text and image alt text.
    pub label: Option<String>,
}

impl Options {
    /// Options with the three required values.
    pub fn new(kind: &str, slug: &str, page: &str) -> Self {
        Options { kind: kind.into(), slug: slug.into(), page: page.into(), ..Default::default() }
    }
}

/// Invalid input: an unknown type, a malformed slug, a page outside /best/ or an unknown size.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BadgeError(pub &'static str);

impl fmt::Display for BadgeError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.0)
    }
}

impl std::error::Error for BadgeError {}

fn size_of(o: &Options) -> Option<(u32, u32)> {
    match o.size.as_deref().unwrap_or("regular") {
        "regular" => Some((320, 64)),
        "small" => Some((240, 48)),
        _ => None,
    }
}

fn check(o: &Options) -> Result<(), BadgeError> {
    if o.kind != "company" && o.kind != "product" {
        return Err(BadgeError("type must be \"company\" or \"product\""));
    }
    let slug_ok = !o.slug.is_empty()
        && o.slug.split('-').all(|part| !part.is_empty() && part.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit()));
    if !slug_ok {
        return Err(BadgeError("slug must be lowercase letters, digits and hyphens"));
    }
    if !o.page.starts_with("/best/") {
        return Err(BadgeError("page must start with /best/"));
    }
    if size_of(o).is_none() {
        return Err(BadgeError("size must be \"regular\" or \"small\""));
    }
    Ok(())
}

fn base(o: &Options) -> String {
    let b = o.base.as_deref().filter(|s| !s.is_empty()).unwrap_or("https://trustlist.uk");
    b.trim_end_matches('/').to_string()
}

/// Matches JavaScript's encodeURIComponent.
fn enc(s: &str) -> String {
    let mut out = String::new();
    for b in s.bytes() {
        if b.is_ascii_alphanumeric() || b"-_.!~*'()".contains(&b) {
            out.push(b as char);
        } else {
            out.push_str(&format!("%{:02X}", b));
        }
    }
    out
}

fn query(o: &Options) -> String {
    let mut q = format!("type={}&slug={}&page={}", enc(&o.kind), enc(&o.slug), enc(&o.page));
    if let Some(e) = o.edition.as_deref().filter(|s| !s.is_empty()) {
        q.push_str(&format!("&edition={}", enc(e)));
    }
    q
}

fn esc(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;").replace('\'', "&#39;")
}

/// The ranking page the badge cites.
pub fn ranking_url(o: &Options) -> Result<String, BadgeError> {
    check(o)?;
    Ok(format!("{}{}", base(o), o.page))
}

/// The badge image, built by TrustList from the published edition.
pub fn badge_url(o: &Options) -> Result<String, BadgeError> {
    check(o)?;
    Ok(format!("{}/badges/rank?{}", base(o), query(o)))
}

/// TrustList's record of the rank the badge cites.
pub fn verify_url(o: &Options) -> Result<String, BadgeError> {
    check(o)?;
    Ok(format!("{}/badges/verify?{}", base(o), query(o)))
}

/// The snippet to print: the badge linking to its ranking, and a small Verify link.
pub fn html(o: &Options) -> Result<String, BadgeError> {
    check(o)?;
    let (w, h) = size_of(o).expect("checked");
    let label = o.label.as_deref().filter(|s| !s.is_empty()).unwrap_or("TrustList rank badge");
    Ok(format!(
        "<a href=\"{}\" title=\"See this ranking on TrustList\"><img src=\"{}\" width=\"{}\" height=\"{}\" alt=\"{}\" loading=\"lazy\" style=\"border:0;max-width:100%;height:auto\"></a> <a href=\"{}\" style=\"font:11px system-ui,sans-serif;color:#64748b\">Verify</a>",
        esc(&ranking_url(o)?),
        esc(&badge_url(o)?),
        w,
        h,
        esc(label),
        esc(&verify_url(o)?)
    ))
}
