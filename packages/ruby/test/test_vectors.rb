# frozen_string_literal: true

require "json"
require "minitest/autorun"
require_relative "../lib/trustlist_badge"

class VectorTest < Minitest::Test
  VECTORS = JSON.parse(File.read(File.join(__dir__, "badge-vectors.json")))

  def args(input)
    { type: input["type"], slug: input["slug"], page: input["page"], edition: input["edition"],
      base: input["base"], size: input["size"] || "regular" }
  end

  def test_valid
    VECTORS["valid"].each do |c|
      a = args(c["input"])
      assert_equal c["rankingUrl"], TrustListBadge.ranking_url(**a)
      assert_equal c["badgeUrl"], TrustListBadge.badge_url(**a)
      assert_equal c["verifyUrl"], TrustListBadge.verify_url(**a)
      assert_equal c["badgeHtml"], TrustListBadge.html(**a, label: c["input"]["label"])
    end
  end

  def test_invalid
    VECTORS["invalid"].each do |c|
      assert_raises(TrustListBadge::Error) { TrustListBadge.html(**args(c["input"])) }
    end
  end
end
