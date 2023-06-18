#!/usr/bin/env bash

docker build -f Dockerfile.tests.8.3.1 -t bq-cypress-test:8.3.1 .

docker run --rm --shm-size=2gb --name cyprestests \
-v $PWD:/src bq-cypress-test:8.3.1 bash -c 'cd /src ; npm i ; npx browserslist@latest --update-db ; $(npm bin)/cypress run --record --key 4bf6a86a-d799-47d2-b686-6bfcabd05099'

docker run --rm --shm-size=2gb --name cyprestests \
-v $PWD:/src bq-cypress-test:8.3.1 bash -c 'cd /src ; npm i ; npx browserslist@latest --update-db ; $(npm bin)/cypress run -b edge --record --key 4bf6a86a-d799-47d2-b686-6bfcabd05099'

docker run --rm --shm-size=2gb --name cyprestests \
-v $PWD:/src bq-cypress-test:8.3.1 bash -c 'cd /src ; npm i ; npx browserslist@latest --update-db ; $(npm bin)/cypress run -b chromium --record --key 4bf6a86a-d799-47d2-b686-6bfcabd05099'

docker run --rm --shm-size=2gb --name cyprestests \
-v $PWD:/src bq-cypress-test:8.3.1 bash -c 'cd /src ; npm i ; npx browserslist@latest --update-db ; $(npm bin)/cypress run -b chrome --record --key 4bf6a86a-d799-47d2-b686-6bfcabd05099'

docker run --rm --shm-size=2gb --name cyprestests \
-v $PWD:/src bq-cypress-test:8.3.1 bash -c 'cd /src ; npm i ; npx browserslist@latest --update-db ; $(npm bin)/cypress run -b firefox --record --key 4bf6a86a-d799-47d2-b686-6bfcabd05099'

