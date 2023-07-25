import * as core from '@actions/core'

type ActionConfig = {
  endpoint: string
  username: string
  key: string
  githubToken: string
  githubOwner: string
  githubRepo: string
  githubRunId: string
}

const getConfig = (): ActionConfig => {
  const githubToken = process.env.GITHUB_TOKEN || core.getInput('github_token')
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN env variable is missing')
  }

  const fullRepository = process.env.GITHUB_REPOSITORY
  if (!fullRepository) {
    throw new Error('Missing GITHUB_REPOSITORY env variable')
  }

  const [githubOwner, githubRepo] = fullRepository.split('/')
  const githubRunId = process.env.GITHUB_RUN_ID
  if (!githubRunId) {
    throw new Error('GITHUB_RUN_ID missing')
  }

  const endpoint =
    process.env.OPENOBSERVE_ENDPOINT || core.getInput('openobserve_endpoint')
  const username =
    process.env.OPENOBSERVE_USERNAME || core.getInput('openobserve_username')
  const key = process.env.OPENOBSERVE_KEY || core.getInput('openobserve_key')

  if (!endpoint || !username || !key) {
    throw new Error('Missing OpenObserve credentials')
  }

  return {
    githubOwner,
    githubRepo,
    githubToken,
    githubRunId,
    endpoint,
    username,
    key
  }
}

export default getConfig
