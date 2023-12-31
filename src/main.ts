import * as core from '@actions/core'
import getConfig from './getConfig'

import {fetchRunLogs, uploadLogs} from './action'

async function run(): Promise<void> {
  try {
    const config = getConfig()
    const logs = await fetchRunLogs(
      config.githubToken,
      config.githubOwner,
      config.githubRepo,
      config.githubRunId
    )
    const result = await uploadLogs(
      config.endpoint,
      config.username,
      config.key,
      logs
    )

    // eslint-disable-next-line no-console
    console.log(result.data)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
