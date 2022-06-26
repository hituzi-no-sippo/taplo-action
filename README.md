# Taplo GitHub Action <a href="https://github.com/hituzi-no-sippo/taplo-action/actions"><img alt="taplo-action status" src="https://github.com/hituzi-no-sippo/taplo-action/workflows/build-test/badge.svg"></a>

GitHub Action to run [Taplo](https://taplo.tamasfe.dev/).

Taplo is TOML formatter and linter.

Installs the Taplo binary (from GitHub releases), and caches it.
Any Taplo command can then be run.

## Usage

```yaml
- uses: actions/checkout@v3
- uses: hituzi-no-sippo/taplo-action@1.0.0
  with:
```

Based off [JohnnyMorganz/stylua-action](https://github.com/JohnnyMorganz/stylua-action),
licensed under [MIT](https://github.com/Roblox/setup-foreman/blob/master/LICENSE.txt)
