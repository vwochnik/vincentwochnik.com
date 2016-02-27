#!/bin/bash

DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" SIGINT SIGTERM

cp -R ./. $TMP_DIR

pushd $TMP_DIR

git init
git add .
git commit -m "Site built at $DATE"
git remote add origin git@github.com:vwochnik/vwochnik.github.io.git
git push -fu origin master

popd

rm -rf $TMP_DIR
