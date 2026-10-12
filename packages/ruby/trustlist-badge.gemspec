# frozen_string_literal: true

require_relative "lib/trustlist_badge"

Gem::Specification.new do |s|
  s.name = "trustlist-badge"
  s.version = TrustListBadge::VERSION
  s.summary = "Show your TrustList rank badge on your website."
  s.description = "Builds the TrustList rank badge snippet: the badge image, linked to the ranking it cites, with a small Verify link."
  s.authors = ["TrustList"]
  s.license = "MIT"
  s.homepage = "https://trustlist.uk/developers"
  s.files = ["lib/trustlist_badge.rb", "README.md", "LICENSE"]
  s.required_ruby_version = ">= 2.7"
  s.metadata = {
    "source_code_uri" => "https://github.com/eharain/trustlist-public/tree/main/packages/ruby",
    "documentation_uri" => "https://github.com/eharain/trustlist-public/blob/main/spec/badge.md",
    "bug_tracker_uri" => "https://github.com/eharain/trustlist-public/issues",
    "rubygems_mfa_required" => "true",
  }
end
