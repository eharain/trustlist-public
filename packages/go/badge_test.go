package badge

import (
	"encoding/json"
	"os"
	"testing"
)

type vectors struct {
	Valid []struct {
		Input      map[string]string `json:"input"`
		RankingURL string            `json:"rankingUrl"`
		BadgeURL   string            `json:"badgeUrl"`
		VerifyURL  string            `json:"verifyUrl"`
		BadgeHTML  string            `json:"badgeHtml"`
	} `json:"valid"`
	Invalid []struct {
		Input map[string]string `json:"input"`
	} `json:"invalid"`
}

func opts(m map[string]string) Options {
	return Options{Type: m["type"], Slug: m["slug"], Page: m["page"], Edition: m["edition"], Base: m["base"], Size: m["size"], Label: m["label"]}
}

func TestVectors(t *testing.T) {
	raw, err := os.ReadFile("testdata/badge-vectors.json")
	if err != nil {
		t.Fatal(err)
	}
	var v vectors
	if err := json.Unmarshal(raw, &v); err != nil {
		t.Fatal(err)
	}
	for i, c := range v.Valid {
		o := opts(c.Input)
		check := func(name, want string, got string, err error) {
			if err != nil || got != want {
				t.Errorf("valid[%d] %s:\n got %q (%v)\nwant %q", i, name, got, err, want)
			}
		}
		got, err := RankingURL(o)
		check("RankingURL", c.RankingURL, got, err)
		got, err = BadgeURL(o)
		check("BadgeURL", c.BadgeURL, got, err)
		got, err = VerifyURL(o)
		check("VerifyURL", c.VerifyURL, got, err)
		got, err = HTML(o)
		check("HTML", c.BadgeHTML, got, err)
	}
	for i, c := range v.Invalid {
		if _, err := HTML(opts(c.Input)); err == nil {
			t.Errorf("invalid[%d]: expected an error for %v", i, c.Input)
		}
	}
}
