import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as semver from 'semver'
import taplo from './taplo'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    let version = semver.clean(core.getInput('version'))

    let releases
    if (!version || version === '') {
      core.debug(
        'No version provided, or version provided is malformed, finding latest release version'
      )
      releases = await taplo.getReleases(token)

      const latestVersion = taplo.getLatestVersion(releases)
      if (!latestVersion) {
        throw new Error(
          'Could not find latest release version. Please specify an explicit version'
        )
      }
      version = latestVersion
    }

    // See if we already have the tool installed
    core.debug(`Looking for cached version of binary with version ${version}`)
    const taploDirectory = tc.find('taplo', version)
    if (taploDirectory) {
      core.debug(`Found cached version of taplo: ${taploDirectory}`)
      core.addPath(taploDirectory)
    } else {
      core.debug('No cached version found, downloading new release')

      // If we haven't already looked for the releases, then load them up
      if (!releases) releases = await taplo.getReleases(token)

      core.debug(`Retrieving matching release for user input: ${version}`)
      const release = taplo.chooseRelease(version, releases)

      if (!release) {
        throw new Error(`Could not find release for version ${version}`)
      }

      core.debug(`Chose release ${release.tag_name}`)
      const asset = taplo.chooseAsset(release)

      if (!asset) {
        throw new Error(
          `Could not find asset for ${release.tag_name} on platform ${process.platform}`
        )
      }

      core.debug(`Chose asset ${asset.browser_download_url}`)

      const downloadedPath = await tc.downloadTool(asset.browser_download_url)
      const extractedPath = await tc.extractTar(downloadedPath)
      await tc.cacheDir(extractedPath, 'taplo', version)
      core.addPath(extractedPath)

      if (process.platform === 'darwin' || process.platform === 'linux') {
        await exec(`chmod +x ${extractedPath}/taplo`)
      }
    }

    const args = core.getInput('args')
    core.debug(`Running taplo with arguments: ${args}`)

    await exec(`taplo ${args}`)
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`)
  }
}

run()
