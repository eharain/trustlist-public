package uk.trustlist.badge;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;

class BadgeTest {
    private static JsonObject vectors() throws Exception {
        return JsonParser.parseString(new String(Files.readAllBytes(Paths.get("src/test/resources/badge-vectors.json")), StandardCharsets.UTF_8)).getAsJsonObject();
    }

    private static String s(JsonObject o, String k) {
        return o.has(k) ? o.get(k).getAsString() : null;
    }

    private static Badge.Options opts(JsonObject in) {
        Badge.Options o = new Badge.Options(s(in, "type"), s(in, "slug"), s(in, "page"));
        o.edition = s(in, "edition");
        o.base = s(in, "base");
        o.size = s(in, "size");
        o.label = s(in, "label");
        return o;
    }

    @Test
    void validVectors() throws Exception {
        JsonArray valid = vectors().getAsJsonArray("valid");
        for (JsonElement e : valid) {
            JsonObject c = e.getAsJsonObject();
            Badge.Options o = opts(c.getAsJsonObject("input"));
            assertEquals(s(c, "rankingUrl"), Badge.rankingUrl(o));
            assertEquals(s(c, "badgeUrl"), Badge.badgeUrl(o));
            assertEquals(s(c, "verifyUrl"), Badge.verifyUrl(o));
            assertEquals(s(c, "badgeHtml"), Badge.html(o));
        }
    }

    @Test
    void invalidVectors() throws Exception {
        for (JsonElement e : vectors().getAsJsonArray("invalid")) {
            Badge.Options o = opts(e.getAsJsonObject().getAsJsonObject("input"));
            assertThrows(IllegalArgumentException.class, () -> Badge.html(o));
        }
    }
}
