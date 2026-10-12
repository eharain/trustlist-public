# frozen_string_literal: true

require "erb"

# Builds TrustList rank badge links: the badge image URL, the ranking it links to, the verify URL,
# and a ready-to-print HTML snippet. See spec/badge.md in https://github.com/eharain/trustlist-public.
#
#   TrustListBadge.html(type: "company", slug: "your-company", page: "/best/web-design-agency/london")
module TrustListBadge
  VERSION = "0.1.0"

  class Error < ArgumentError; end

  SIZES = { "regular" => [320, 64], "small" => [240, 48] }.freeze
  SLUG = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/

  module_function

  # The ranking page the badge cites.
  def ranking_url(type:, slug:, page:, edition: nil, base: nil, size: "regular")
    check(type, slug, page, size)
    base_of(base) + page
  end

  # The badge image, built by TrustList from the published edition.
  def badge_url(type:, slug:, page:, edition: nil, base: nil, size: "regular")
    check(type, slug, page, size)
    "#{base_of(base)}/badges/rank?#{query(type, slug, page, edition)}"
  end

  # TrustList's record of the rank the badge cites.
  def verify_url(type:, slug:, page:, edition: nil, base: nil, size: "regular")
    check(type, slug, page, size)
    "#{base_of(base)}/badges/verify?#{query(type, slug, page, edition)}"
  end

  # The snippet to print: the badge linking to its ranking, and a small Verify link.
  def html(type:, slug:, page:, edition: nil, base: nil, size: "regular", label: nil)
    check(type, slug, page, size)
    w, h = SIZES[size]
    args = { type: type, slug: slug, page: page, edition: edition, base: base, size: size }
    label = "TrustList rank badge" if label.nil? || label.empty?
    %(<a href="#{esc(ranking_url(**args))}" title="See this ranking on TrustList"><img src="#{esc(badge_url(**args))}" ) +
      %(width="#{w}" height="#{h}" alt="#{esc(label)}" loading="lazy" style="border:0;max-width:100%;height:auto"></a> ) +
      %(<a href="#{esc(verify_url(**args))}" style="font:11px system-ui,sans-serif;color:#64748b">Verify</a>)
  end

  def check(type, slug, page, size)
    raise Error, 'type must be "company" or "product"' unless %w[company product].include?(type)
    raise Error, "slug must be lowercase letters, digits and hyphens" unless slug.is_a?(String) && SLUG.match?(slug)
    raise Error, "page must start with /best/" unless page.is_a?(String) && page.start_with?("/best/")
    raise Error, 'size must be "regular" or "small"' unless SIZES.key?(size)
  end

  def base_of(base)
    (base.nil? || base.empty? ? "https://trustlist.uk" : base).sub(%r{/+\z}, "")
  end

  # Matches JavaScript's encodeURIComponent.
  def enc(value)
    ERB::Util.url_encode(value).gsub("%21", "!").gsub("%2A", "*").gsub("%27", "'").gsub("%28", "(").gsub("%29", ")")
  end

  def query(type, slug, page, edition)
    parts = [["type", type], ["slug", slug], ["page", page]]
    parts << ["edition", edition] unless edition.nil? || edition.empty?
    parts.map { |k, v| "#{k}=#{enc(v)}" }.join("&")
  end

  def esc(s)
    s.gsub("&", "&amp;").gsub("<", "&lt;").gsub(">", "&gt;").gsub('"', "&quot;").gsub("'", "&#39;")
  end

  private_class_method :check, :base_of, :enc, :query, :esc
end
