using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace TrustList
{
    /// <summary>Options for one TrustList rank badge. Type, Slug and Page are required.</summary>
    public sealed class BadgeOptions
    {
        /// <summary>"company" or "product".</summary>
        public string Type { get; set; } = "company";
        /// <summary>The listing's slug, as in its TrustList address.</summary>
        public string Slug { get; set; }
        /// <summary>The ranking's path, starting with /best/.</summary>
        public string Page { get; set; }
        /// <summary>Optional edition, e.g. "2026-Q4". Default: the latest edition that has the page.</summary>
        public string Edition { get; set; }
        /// <summary>Optional TrustList address. Default https://trustlist.uk.</summary>
        public string Base { get; set; }
        /// <summary>"regular" (320 x 64, default) or "small" (240 x 48).</summary>
        public string Size { get; set; }
        /// <summary>Optional link text and image alt text.</summary>
        public string Label { get; set; }
    }

    /// <summary>
    /// Builds TrustList rank badge links: the badge image, the ranking it links to, the verify page,
    /// and a ready-to-print HTML snippet. See spec/badge.md in the repository.
    /// </summary>
    public static class Badge
    {
        private static readonly Regex SlugPattern = new Regex("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.CultureInvariant);
        private static readonly Dictionary<string, int[]> Sizes = new Dictionary<string, int[]>
        {
            ["regular"] = new[] { 320, 64 },
            ["small"] = new[] { 240, 48 },
        };

        /// <summary>The ranking page the badge cites.</summary>
        public static string RankingUrl(BadgeOptions o) { Check(o); return BaseOf(o) + o.Page; }

        /// <summary>The badge image, built by TrustList from the published edition.</summary>
        public static string BadgeUrl(BadgeOptions o) { Check(o); return BaseOf(o) + "/badges/rank?" + Query(o); }

        /// <summary>TrustList's record of the rank the badge cites.</summary>
        public static string VerifyUrl(BadgeOptions o) { Check(o); return BaseOf(o) + "/badges/verify?" + Query(o); }

        /// <summary>The snippet to print: the badge linking to its ranking, and a small Verify link.</summary>
        public static string Html(BadgeOptions o)
        {
            Check(o);
            var wh = Sizes[o.Size ?? "regular"];
            var label = string.IsNullOrEmpty(o.Label) ? "TrustList rank badge" : o.Label;
            return "<a href=\"" + Esc(RankingUrl(o)) + "\" title=\"See this ranking on TrustList\"><img src=\"" + Esc(BadgeUrl(o))
                + "\" width=\"" + wh[0] + "\" height=\"" + wh[1] + "\" alt=\"" + Esc(label)
                + "\" loading=\"lazy\" style=\"border:0;max-width:100%;height:auto\"></a> <a href=\"" + Esc(VerifyUrl(o))
                + "\" style=\"font:11px system-ui,sans-serif;color:#64748b\">Verify</a>";
        }

        private static void Check(BadgeOptions o)
        {
            if (o == null) throw new ArgumentNullException(nameof(o));
            if (o.Type != "company" && o.Type != "product") throw new ArgumentException("type must be \"company\" or \"product\"");
            if (string.IsNullOrEmpty(o.Slug) || !SlugPattern.IsMatch(o.Slug)) throw new ArgumentException("slug must be lowercase letters, digits and hyphens");
            if (o.Page == null || !o.Page.StartsWith("/best/", StringComparison.Ordinal)) throw new ArgumentException("page must start with /best/");
            if (!Sizes.ContainsKey(o.Size ?? "regular")) throw new ArgumentException("size must be \"regular\" or \"small\"");
        }

        private static string BaseOf(BadgeOptions o) => (string.IsNullOrEmpty(o.Base) ? "https://trustlist.uk" : o.Base).TrimEnd('/');

        private static string Query(BadgeOptions o)
        {
            var q = "type=" + Uri.EscapeDataString(o.Type) + "&slug=" + Uri.EscapeDataString(o.Slug) + "&page=" + Uri.EscapeDataString(o.Page);
            if (!string.IsNullOrEmpty(o.Edition)) q += "&edition=" + Uri.EscapeDataString(o.Edition);
            return q;
        }

        private static string Esc(string s) =>
            s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;").Replace("'", "&#39;");
    }
}
