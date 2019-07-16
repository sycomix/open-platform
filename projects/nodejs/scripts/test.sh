#!/bin/bash
set -e

# Load environment variables if file exists.
if [ -f ../../settings.sh ]; then
  source ../../settings.sh
fi
if [ -f ../../settings.test.sh ]; then
  source ../../settings.test.sh
fi

# Run migrations if script is present.
if [[ $(yarn run --non-interactive | grep "^  migrations" | wc -l) > 0 ]]; then
  yarn migrations
fi

# Publish coverage report if flag is present.
COVERAGE_ARGUMENTS=""
if [[ $* =~ "--coverage" ]]; then
  COVERAGE_ARGUMENTS="nyc --nycrc-path ../../.nycrc"
fi

# Watch tests if flag is present.
WATCH_ARGUMENTS=""
if [[ $* =~ "--watch" ]]; then
  WATCH_ARGUMENTS="--watch --watch-extensions ts"
fi

export STAGE="test"
export TS_NODE_PROJECT="./tsconfig.spec.json"

$COVERAGE_ARGUMENTS \
  mocha \
  --exit \
  --recursive \
  --require ts-node/register \
  --reporter mocha-multi-reporters \
  --reporter-options configFile="../../mocha-multi-reporters.json" \
  $WATCH_ARGUMENTS \
  "src/**/*.spec.ts"
