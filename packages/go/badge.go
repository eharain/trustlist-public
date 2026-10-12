// Package badge builds TrustList rank badge links: the badge image URL, the ranking it links to,
// the verify URL, and a ready-to-print HTML snippet. See spec/badge.md in the repository.
//
//	html, err := badge.HTML(badge.Options{Type: "company", Slug: "acme-ltd", Page: "/best/web-design-agency/london"})
package badge

import (
	"errors"
	"fmt"
	"html"
	"net/url"
	"regexp"
	"strings"
)

// Options describe one badge. Type, Slug and Page are required.
type Options struct {
	Type    string // "company" or "product"
	Slug    string // the listing's slug
	Page    string // the ranking's path, starting with /best/
	Edition string // optional, e.g. "2026-Q4"
	Base    string // optional, default https://trustlist.uk
	Size    string // optional, "regular" (default) or "small"
	Label   string // optional link text and alt text
}

var slugRE = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

var sizes = map[string][2]int{"regular": {320, 64}, "small": {240, 48}}

func (o Options) check() error {
	if o.Type != "company" && o.Type != "product" {
		return errors.New(`type must be "company" or "product"`)
	}
	if !slugRE.MatchString(o.Slug) {
		return errors.New("slug must be lowercase letters, digits and hyphens")
	}
	if !strings.HasPrefix(o.Page, "/best/") {
		return errors.New("page must start with /best/")
	}
	if _, ok := sizes[o.size()]; !ok {
		return errors.New(`size must be "regular" or "small"`)
	}
	return nil
}

func (o Options) size() string {
	if o.Size == "" {
		return "regular"
	}
	return o.Size
}

func (o Options) base() string {
	b := o.Base
	if b == "" {
		b = "https://trustlist.uk"
	}
	return strings.TrimRight(b, "/")
}

// encodeURIComponent matches JavaScript's encodeURIComponent.
func encodeURIComponent(s string) string {
	return strings.NewReplacer("+", "%20", "%21", "!", "%27", "'", "%28", "(", "%29", ")", "%2A", "*", "%7E", "~").Replace(url.QueryEscape(s))
}

func (o Options) query() string {
	parts := []string{"type=" + encodeURIComponent(o.Type), "slug=" + encodeURIComponent(o.Slug), "page=" + encodeURIComponent(o.Page)}
	if o.Edition != "" {
		parts = append(parts, "edition="+encodeURIComponent(o.Edition))
	}
	return strings.Join(parts, "&")
}

// RankingURL is the ranking page the badge cites.
func RankingURL(o Options) (string, error) {
	if err := o.check(); err != nil {
		return "", err
	}
	return o.base() + o.Page, nil
}

// BadgeURL is the badge image, built by TrustList from the published edition.
func BadgeURL(o Options) (string, error) {
	if err := o.check(); err != nil {
		return "", err
	}
	return o.base() + "/badges/rank?" + o.query(), nil
}

// VerifyURL is TrustList's record of the rank the badge cites.
func VerifyURL(o Options) (string, error) {
	if err := o.check(); err != nil {
		return "", err
	}
	return o.base() + "/badges/verify?" + o.query(), nil
}

func esc(s string) string {
	return strings.ReplaceAll(html.EscapeString(s), "&#34;", "&quot;")
}

// HTML is the snippet to print: the badge linking to its ranking, and a small Verify link.
func HTML(o Options) (string, error) {
	if err := o.check(); err != nil {
		return "", err
	}
	label := o.Label
	if label == "" {
		label = "TrustList rank badge"
	}
	wh := sizes[o.size()]
	ranking, _ := RankingURL(o)
	img, _ := BadgeURL(o)
	verify, _ := VerifyURL(o)
	return fmt.Sprintf(`<a href="%s" title="See this ranking on TrustList"><img src="%s" width="%d" height="%d" alt="%s" loading="lazy" style="border:0;max-width:100%%;height:auto"></a> <a href="%s" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>`,
		esc(ranking), esc(img), wh[0], wh[1], esc(label), esc(verify)), nil
}
