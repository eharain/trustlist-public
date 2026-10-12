import json
import pathlib
import unittest

from trustlist_badge import BadgeError, badge_html, badge_url, ranking_url, verify_url

VECTORS = json.loads((pathlib.Path(__file__).parent / "badge-vectors.json").read_text(encoding="utf-8"))


def args(inp):
    return dict(type=inp.get("type"), slug=inp.get("slug"), page=inp.get("page"), edition=inp.get("edition"),
                base=inp.get("base"), size=inp.get("size", "regular"))


class VectorTests(unittest.TestCase):
    def test_valid(self):
        for case in VECTORS["valid"]:
            a = args(case["input"])
            self.assertEqual(ranking_url(**a), case["rankingUrl"])
            self.assertEqual(badge_url(**a), case["badgeUrl"])
            self.assertEqual(verify_url(**a), case["verifyUrl"])
            self.assertEqual(badge_html(**a, label=case["input"].get("label")), case["badgeHtml"])

    def test_invalid(self):
        for case in VECTORS["invalid"]:
            with self.assertRaises(BadgeError):
                badge_html(**args(case["input"]))


if __name__ == "__main__":
    unittest.main()
