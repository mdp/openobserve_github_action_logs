const github = require('@actions/github');
const fetch = require('node-fetch')

// The following comment is the python code for fetching logs from Github Actions.
// import os
// import requests
// import io
// import logging
// import sys
// import signal
// import json
// # don't remove, it loads the configuration
// import logger


// def main():
//     # User provided variables
//     github_repo = os.environ.get("INPUT_GITHUB_REPOSITORY")
//     try:
//         assert github_repo not in (None, '')
//     except:
//         output = "The input github repository is not set"
//         print(f"Error: {output}")
//         sys.exit(-1)

//     github_run_id = os.environ.get("INPUT_GITHUB_RUN_ID")
//     try:
//         assert github_run_id not in (None, '')
//     except:
//         output = "The input github run id is not set"
//         print(f"Error: {output}")
//         sys.exit(-1)

//     github_token = os.environ.get("INPUT_GITHUB_TOKEN")
//     try:
//         assert github_token not in (None, '')
//     except:
//         output = "The input github token is not set"
//         print(f"Error: {output}")
//         sys.exit(-1)

//     github_org = os.environ.get("INPUT_GITHUB_ORG")
//     try:
//         assert github_org not in (None, '')
//     except:
//         output = "The input github org is not set"
//         print(f"Error: {output}")
//         sys.exit(-1)
//     elastic_logger = logging.getLogger("elastic")
//     metadata_url = f"https://api.github.com/repos/{github_org}/{github_repo}/actions/runs/{github_run_id}"
//     try:
//         r = requests.get(metadata_url, stream=True, headers={
//             "Authorization": f"token {github_token}"
//         })
//         metadata = json.loads(r.content)
//         jobs_url = metadata.get('jobs_url')
//         metadata.pop('repository')
//         metadata.pop('head_repository')
//         metadata = {
//             "metadata_" + k: v for k,v in metadata.items()
//         }
//     except Exception as exc:
//         output = "Failed to get run metadata" + str(exc)
//         print(f"Error: {output}")
//         print(f"::set-output name=result::{output}")
//         sys.exit(-1)

//     # extract all done jobs
//     jobs = {}
//     try:
//         jobs_response = requests.get(jobs_url, headers={
//             "Authorization": f"token {github_token}"
//         })
//         if not jobs_response.ok:
//             raise Exception("Failed to get run jobs")
//         _jobs = json.loads(jobs_response.content)
//         for job in _jobs.get('jobs'):
//             job_id = job.get('id')
//             # no logs for jobs that weren't completed
//             if not job.get('status') == 'completed':
//                 continue
//             jobs[job_id] = {
//                 "job_id": job_id,
//                 "job_name": job.get('name'),
//                 "job_status": job.get('status'),
//                 "job_conclusion": job.get('conclusion'),
//                 "job_steps": job.get('steps')
//             }
//             # log this metadata to elastic
//             elastic_logger.info("Job metadata", extra={
//                 **jobs.get(job_id)
//             })
//     except Exception as exc:
//         output = "Failed to get run jobs" + str(exc)
//         print(f"Error: {output}")
//         print(f"::set-output name=result::{output}")
//         sys.exit(-1)

//     for job_id in jobs:
//         try:
//             job_logs_url = f"https://api.github.com/repos/{github_org}/{github_repo}/actions/jobs/{job_id}/logs"
//             r = requests.get(job_logs_url, stream=True, headers={
//                 "Authorization": f"token {github_token}"
//             })
//             if not r.ok:
//                 output = "Failed to download logs"
//                 print(f"Error: {output}")
//                 print(f"::set-output name=result::{output}")
//                 sys.exit(-1)

//             logs = io.BytesIO(r.content)
//             for log in logs:
//                 elastic_logger.info(log.strip().decode(), extra={
//                     "job_id": job_id,
//                     "job_name": jobs.get(job_id).get('job_name'),
//                     "repo": github_repo,
//                     "run_id": github_run_id,
//                     **metadata
//                 })

//         except requests.exceptions.HTTPError as errh:
//             output = "GITHUB API Http Error:" + str(errh)
//             print(f"Error: {output}")
//             print(f"::set-output name=result::{output}")
//             sys.exit(-1)
//         except requests.exceptions.ConnectionError as errc:
//             output = "GITHUB API Error Connecting:" + str(errc)
//             print(f"Error: {output}")
//             print(f"::set-output name=result::{output}")
//             sys.exit(-1)
//         except requests.exceptions.Timeout as errt:
//             output = "Timeout Error:" + str(errt)
//             print(f"Error: {output}")
//             print(f"::set-output name=result::{output}")
//             sys.exit(-1)
//         except requests.exceptions.RequestException as err:
//             output = "GITHUB API Non catched error connecting:" + str(err)
//             print(f"Error: {output}")
//             print(f"::set-output name=result::{output}")
//             sys.exit(-1)
//
// And this is the nodejs function to do the same thing using the Fetch API
const getActionLogs = async () => {
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

    const jobRequest = await octokit.rest.actions.listJobsForWorkflowRun({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        run_id: process.env.GITHUB_RUN_ID,
    });
    const jobs = jobRequest.data.jobs;
    const jobsDone = jobs.filter(job => job.status === 'completed');
    const jobsLogs = jobsDone.map( async (job) => {
        const redirectResponse = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            job_id: job.id,
        });
        const logsResponse = await fetch(redirectResponse.headers.location);
        logsResponse
        for (const log of logs) {
            console.log(log);
        }
        return logs;
    });
    return jobsLogs;
}


