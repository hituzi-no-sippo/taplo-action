# Taplo GitHub Action <a href="https://github.com/hituzi-no-sippo/taplo-action/actions"><img alt="taplo-action status" src="https://github.com/hituzi-no-sippo/taplo-action/workflows/build-test/badge.svg"></a>

GitHub Action to run [Taplo](https://taplo.tamasfe.dev/).

Taplo is TOML formatter and linter.

Installs the Taplo binary (from GitHub releases), and caches it.
Any Taplo command can then be run.

## Usage

```yaml
- uses: actions/checkout@v3
- uses: hituzi-no-sippo/taplo-action@v1.0.0
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    # CLI arguments
    args: lint
    # Specify `version` to pin a specific version, otherwise action will always use latest version/automatically update
```

### Parameters

#### `token` (Required)

GitHub token.
Required since the binary is downloaded from GitHub releases (to speed download)

#### `args` (Required)

The arguments to pass to the Taplo binary

#### `version` (Optional)

The version of Taplo to use. Follows semver syntax.
If not specified, installs the latest release.
**It is recommended to pin your version so that updates to Taplo don't lead to unwanted changes in the action without explicitly updating.**

Based off [JohnnyMorganz/stylua-action](https://github.com/JohnnyMorganz/stylua-action),
licensed under [MIT](https://github.com/Roblox/setup-foreman/blob/master/LICENSE.txt)
