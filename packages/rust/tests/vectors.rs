use trustlist_badge::{badge_url, html, ranking_url, verify_url, Options};

fn opts(v: &serde_json::Value) -> Options {
    let s = |k: &str| v.get(k).and_then(|x| x.as_str()).map(String::from);
    Options {
        kind: s("type").unwrap_or_default(),
        slug: s("slug").unwrap_or_default(),
        page: s("page").unwrap_or_default(),
        edition: s("edition"),
        base: s("base"),
        size: s("size"),
        label: s("label"),
    }
}

#[test]
fn shared_vectors() {
    let raw = std::fs::read_to_string(concat!(env!("CARGO_MANIFEST_DIR"), "/tests/badge-vectors.json")).unwrap();
    let v: serde_json::Value = serde_json::from_str(&raw).unwrap();
    for c in v["valid"].as_array().unwrap() {
        let o = opts(&c["input"]);
        assert_eq!(ranking_url(&o).unwrap(), c["rankingUrl"].as_str().unwrap());
        assert_eq!(badge_url(&o).unwrap(), c["badgeUrl"].as_str().unwrap());
        assert_eq!(verify_url(&o).unwrap(), c["verifyUrl"].as_str().unwrap());
        assert_eq!(html(&o).unwrap(), c["badgeHtml"].as_str().unwrap());
    }
    for c in v["invalid"].as_array().unwrap() {
        assert!(html(&opts(&c["input"])).is_err(), "expected an error for {}", c["input"]);
    }
}
