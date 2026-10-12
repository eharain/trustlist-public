using System;
using System.IO;
using System.Text.Json;
using Xunit;

namespace TrustList.Tests
{
    public class BadgeTests
    {
        private static JsonElement Vectors()
        {
            var path = Path.Combine(AppContext.BaseDirectory, "badge-vectors.json");
            return JsonDocument.Parse(File.ReadAllText(path)).RootElement;
        }

        private static string Get(JsonElement input, string name) =>
            input.TryGetProperty(name, out var v) ? v.GetString() : null;

        private static BadgeOptions Options(JsonElement input) => new BadgeOptions
        {
            Type = Get(input, "type"),
            Slug = Get(input, "slug"),
            Page = Get(input, "page"),
            Edition = Get(input, "edition"),
            Base = Get(input, "base"),
            Size = Get(input, "size"),
            Label = Get(input, "label"),
        };

        [Fact]
        public void ValidVectorsMatchTheSpec()
        {
            foreach (var c in Vectors().GetProperty("valid").EnumerateArray())
            {
                var o = Options(c.GetProperty("input"));
                Assert.Equal(c.GetProperty("rankingUrl").GetString(), Badge.RankingUrl(o));
                Assert.Equal(c.GetProperty("badgeUrl").GetString(), Badge.BadgeUrl(o));
                Assert.Equal(c.GetProperty("verifyUrl").GetString(), Badge.VerifyUrl(o));
                Assert.Equal(c.GetProperty("badgeHtml").GetString(), Badge.Html(o));
            }
        }

        [Fact]
        public void InvalidVectorsThrow()
        {
            foreach (var c in Vectors().GetProperty("invalid").EnumerateArray())
            {
                var o = Options(c.GetProperty("input"));
                Assert.Throws<ArgumentException>(() => Badge.Html(o));
            }
        }
    }
}
