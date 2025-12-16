#!/bin/sh

npm install
#npm run build
npm run generate

# if not exists, create build directory
mkdir -p build

cp -r .output/public/* build
