import {getOctokit} from '@actions/github'
import semver from 'semver'

interface GitHubAsset {
  name: string
  browser_download_url: string
}

interface GitHubRelease {
  tag_name: string
  assets: GitHubAsset[]
}

async function getReleases(token: string): Promise<GitHubRelease[]> {
  const octokit = getOctokit(token)
  const {data: releases} = await octokit.rest.repos.listReleases({
    owner: 'tamasfe',
    repo: 'taplo'
  })
  const cli_releases = extractCLIFrom(releases)

  // Sort by latest release first
  cli_releases.sort((a, b) => semver.rcompare(a.tag_name, b.tag_name))

  return cli_releases
}

function extractCLIFrom(releases: GitHubRelease[]): [] | GitHubRelease[] {
  const tag_prefix = /^release-taplo-cli-/

  return releases
    .filter(release => release.tag_name.startsWith('release-taplo-cli-'))
    .map(release => {
      release.tag_name = release.tag_name.replace(tag_prefix, '')

      return release
    })
}

function getLatestVersion(releases: GitHubRelease[]): string | null {
  return semver.clean(releases[0].tag_name)
}

function chooseRelease(
  version: string,
  releases: GitHubRelease[]
): GitHubRelease | undefined {
  return releases.find(release => semver.satisfies(release.tag_name, version))
}

type Matcher = (name: string) => boolean

const getFilenameMatcher: () => Matcher = () => {
  switch (process.platform) {
    case 'linux':
      return name => name.includes('linux')
    case 'darwin':
      return name => name.includes('macos')
    default:
      throw new Error('Platform not supported')
  }
}

function chooseAsset(release: GitHubRelease): GitHubAsset | undefined {
  const matcher = getFilenameMatcher()

  return release.assets
    .filter(asset => !asset.name.startsWith('taplo-full-'))
    .find(asset => matcher(asset.name))
}

export default {
  getReleases,
  getLatestVersion,
  chooseRelease,
  chooseAsset
}
