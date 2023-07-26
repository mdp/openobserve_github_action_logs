import dotenv from 'dotenv'
import {it, expect} from '@jest/globals'

import {skipUnlessE2E} from './helpers/skipUnlessE2E'
import getConfig from '../src/getConfig'

import {fetchRunLogs, uploadLogs} from '../src/action'

dotenv.config()
const env = getConfig()

skipUnlessE2E()

it('Should fetch logs for a given run ID', async () => {
  const logs = await fetchRunLogs(
    env.githubToken,
    env.githubOwner,
    env.githubRepo,
    env.githubRunId
  )
  for (const [idx, log] of logs.entries()) {
    // Update timestampts to avoid "old data" error
    log._timestamp = new Date().getTime() - logs.length + idx
  }
  // await writeFile(path.join(__dirname, 'fixtures', 'gh_logs.txt'), logs, 'utf-8')
  const result = await uploadLogs(env.endpoint, env.username, env.key, logs)
  expect(result.data.status[0].failed).toBe(0)
  expect(result.data.status[0].successful).toBeGreaterThan(0)
  console.log(result.data)
})
