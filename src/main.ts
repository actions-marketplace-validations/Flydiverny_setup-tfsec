import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'

async function run(): Promise<void> {
  const version = core.getInput('version')

  try {
    let toolPath: string = tc.find('tfsec', version)

    // If not found in cache, download
    if (toolPath) {
      core.info(`Found in cache @ ${toolPath}`)
    } else {
      const destination = path.join(os.homedir(), '.tfsec')
      core.info(`Install destination is ${destination}`)

      await tc.downloadTool(
        `https://github.com/aquasecurity/tfsec/releases/download/${version}/tfsec-checkgen-darwin-amd64`,
        destination
      )

      toolPath = await tc.cacheDir(path.join(destination), 'tfsec', version)
    }

    core.addPath(toolPath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
