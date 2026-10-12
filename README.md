# TrustList public toolkits

Open-source tools for working with [TrustList](https://trustlist.uk), the independent rankings of
software, IT services and B2B firms by category and country.

| Package | Registry | What it does | Status |
|---|---|---|---|
| [`@trustlist/badge`](packages/badge) | [npm](https://www.npmjs.com/package/@trustlist/badge) | Web component that shows a business's TrustList rank badge and links to the ranking | 0.1.0 |
| [`TrustList.Badge`](packages/dotnet) | NuGet | The badge snippet for .NET sites, printed in the page's HTML | 0.1.0 |
| [`packages/go`](packages/go) | Go modules | The badge snippet for Go sites | 0.1.0 |

Every language version follows one [specification](spec/badge.md) and passes the same
[test cases](spec/badge-vectors.json), so a badge prints the same everywhere. More languages are on
the way: PHP, Python, Ruby, Rust, Java and others.

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
