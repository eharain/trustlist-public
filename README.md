# TrustList public toolkits

Open-source tools for working with [TrustList](https://trustlist.uk), the independent rankings of
software, IT services and B2B firms by category and country.

| Package | Language | Registry | Status |
|---|---|---|---|
| [](packages/badge) | JavaScript (web component) | [npm](https://www.npmjs.com/package/@trustlist/badge) | 0.1.0, published |
| [](packages/go) | Go | [Go modules](https://pkg.go.dev/github.com/eharain/trustlist-public/packages/go) | 0.1.0, published |
| [](packages/dotnet) | .NET | NuGet | 0.1.0 |
| [](packages/python) | Python | PyPI | 0.1.0 |
| [](packages/php) | PHP | Packagist | 0.1.0 |
| [](packages/ruby) | Ruby | RubyGems | 0.1.0 |
| [](packages/rust) | Rust | crates.io | 0.1.0 |
| [](packages/java) | Java | Maven Central | 0.1.0 |
| [](packages/dart) | Dart | pub.dev | 0.1.0 |

The server-side packages print the badge link straight into a page's HTML, which every visitor and
search engine sees.

Every language version follows one [specification](spec/badge.md) and passes the same
[test cases](spec/badge-vectors.json), so a badge prints the same everywhere.

Looking for the rankings themselves? See [resources](resources/README.md): how TrustList ranks, the
database engine rankings, software rankings by feature, and B2B companies by country. For what
TrustList publishes each day, see the [daily briefs](briefs/README.md).

Coming next: a WordPress plugin, API clients for JavaScript, Python, PHP, .NET, Go, Rust and more,
and an MCP server so AI assistants can look up TrustList rankings. The developer documentation is at
[trustlist.uk/developers](https://trustlist.uk/developers).

## How rankings work

Rankings are built from evidence each business publishes about itself, checked by us, and recorded as
quarterly editions. The method is at [trustlist.uk/best/methodology](https://trustlist.uk/best/methodology).
Nothing in this repository can change a rank: badges and data are served by TrustList from the
published edition.

## Contributing

Issues and pull requests are welcome. Please keep changes small and describe what they fix.

## Licence

MIT, see [LICENSE](LICENSE). Each package carries its own copy.
