// Write tests for the parseLog function here
// You should test for:
// - The function should return an array of JSON objects
// - The JSON objects should have the correct keys
// - The JSON objects should have the correct values
// - The function should handle empty lines
const { readFile } = require('fs/promises');
const { join } = require('path');
const { it, expect } = require('@jest/globals');

const parseLog = require('../parseLog')

it('should return an array of JSON objects', () => {
    const log = "2023-07-25T13:18:09.1418054Z [INFO] [elastic] [run.py:main:25] [metadata_url] https://api.github.com/repos/elastic/observability-ci/actions/runs/1000";
    const result = parseLog(log);
    expect(Array.isArray(result)).toBe(true);
    expect(typeof result[0]).toBe('object');
});

it('should return ignore invalid dates', () => {
    const log = "2023-07-25T13:BA:09.123456Z [INFO] [elastic] [run.py:main:25] [metadata_url] https://api.github.com/repos/elastic/observability-ci/actions/runs/1000";
    const result = parseLog(log);
    expect(result).toHaveLength(0);
});

it('should still handle blank log lines', () => {
    const log = "2023-07-25T13:18:09.1418054Z";
    const result = parseLog(log);
    expect(result).toHaveLength(1);
    expect(result[0].message).toBeNull();
});


it(`should read from the fixtures log file,
  parse the contents and generate the correct json`, async () => {
    const log = await readFile(join(__dirname, 'fixtures', 'gh_log_1.txt'), 'utf8');
    const result = parseLog(log);
    expect(result[0]._timestamp).toBe('2023-07-25T13:18:08.960Z');
    expect(result[0].message).toBe('##[group]Run yarn build');
    expect(result).toHaveLength(30);
  });
