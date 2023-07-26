<p align="center">
  <a href="https://github.com/mdp/openobserve_github_action_logs/actions"><img alt="build status" src="https://github.com/mdp/openobserve_github_action_logs/actions/workflows/test.yml/badge.svg"></a>
</p>

# Upload Github Action logs to OpenObserve


Example: 

```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          npm ci
      - run: |
          npm run all
      - run: npm test
  inception:
    runs-on: ubuntu-latest
    needs: build-and-test # wait until build-and-test in done
    steps:
      - uses: actions/checkout@v3
      - uses: mdp/openobserve_github_action_logs
        with:
          openobserve_endpoint: ${{ secrets.OPENOBSERVE_ENDPOINT }} # https://api.openobserve.ai/api/[org]/[stream]/_json
          openobserve_username: ${{ secrets.OPENOBSERVE_USERNAME }}
          openobserve_key: ${{ secrets.OPENOBSERVE_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }} # You don't need to set this in Secrets as it's included by default in workflows
```
