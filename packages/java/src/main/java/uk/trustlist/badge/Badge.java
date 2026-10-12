package uk.trustlist.badge;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.regex.Pattern;

/**
 * Builds TrustList rank badge links: the badge image URL, the ranking it links to, the verify URL,
 * and a ready-to-print HTML snippet. See spec/badge.md in https://github.com/eharain/trustlist-public.
 *
 * <pre>
 * String html = Badge.html(new Badge.Options("company", "your-company", "/best/web-design-agency/london"));
 * </pre>
 */
public final class Badge {
    private static final Pattern SLUG = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");

    private Badge() {
    }

    /** Options for one badge. Type, slug and page are required. */
    public static final class Options {
        public String type;
        public String slug;
        public String page;
        public String edition;
        public String base;
        public String size;
        public String label;

        public Options() {
        }

        public Options(String type, String slug, String page) {
            this.type = type;
            this.slug = slug;
            this.page = page;
        }
    }

    /** The ranking page the badge cites. */
    public static String rankingUrl(Options o) {
        check(o);
        return base(o) + o.page;
    }

    /** The badge image, built by TrustList from the published edition. */
    public static String badgeUrl(Options o) {
        check(o);
        return base(o) + "/badges/rank?" + query(o);
    }

    /** TrustList's record of the rank the badge cites. */
    public static String verifyUrl(Options o) {
        check(o);
        return base(o) + "/badges/verify?" + query(o);
    }

    /** The snippet to print: the badge linking to its ranking, and a small Verify link. */
    public static String html(Options o) {
        check(o);
        int[] wh = size(o);
        String label = isEmpty(o.label) ? "TrustList rank badge" : o.label;
        return "<a href=\"" + esc(rankingUrl(o)) + "\" title=\"See this ranking on TrustList\"><img src=\"" + esc(badgeUrl(o))
            + "\" width=\"" + wh[0] + "\" height=\"" + wh[1] + "\" alt=\"" + esc(label)
            + "\" loading=\"lazy\" style=\"border:0;max-width:100%;height:auto\"></a> <a href=\"" + esc(verifyUrl(o))
            + "\" style=\"font:11px system-ui,sans-serif;color:#64748b\">Verify</a>";
    }

    private static boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }

    private static int[] size(Options o) {
        String s = isEmpty(o.size) ? "regular" : o.size;
        if (s.equals("regular")) return new int[] {320, 64};
        if (s.equals("small")) return new int[] {240, 48};
        return null;
    }

    private static void check(Options o) {
        if (o == null) throw new IllegalArgumentException("options are required");
        if (!"company".equals(o.type) && !"product".equals(o.type)) throw new IllegalArgumentException("type must be \"company\" or \"product\"");
        if (isEmpty(o.slug) || !SLUG.matcher(o.slug).matches()) throw new IllegalArgumentException("slug must be lowercase letters, digits and hyphens");
        if (o.page == null || !o.page.startsWith("/best/")) throw new IllegalArgumentException("page must start with /best/");
        if (size(o) == null) throw new IllegalArgumentException("size must be \"regular\" or \"small\"");
    }

    private static String base(Options o) {
        String b = isEmpty(o.base) ? "https://trustlist.uk" : o.base;
        return b.replaceAll("/+$", "");
    }

    /** Matches JavaScript's encodeURIComponent. */
    private static String enc(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8").replace("+", "%20").replace("%21", "!").replace("%27", "'")
                .replace("%28", "(").replace("%29", ")").replace("%7E", "~");
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException(e);
        }
    }

    private static String query(Options o) {
        String q = "type=" + enc(o.type) + "&slug=" + enc(o.slug) + "&page=" + enc(o.page);
        if (!isEmpty(o.edition)) q += "&edition=" + enc(o.edition);
        return q;
    }

    private static String esc(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
}
