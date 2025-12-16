#!/bin/sh

npm install
#npm run build
npm run generate
cp -r .output/public/* build
