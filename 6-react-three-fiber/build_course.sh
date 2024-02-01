#!/bin/bash

usage() {
  echo "usage: ./build_course <courseName>"
}

if [ $# -ne 1 ]; then
  usage
  exit 1
fi

courseName=$1
tempFolder=temp

pathToPublicTemp=$tempFolder/public
pathToPublic=$courseName

pathToSourceTemp=$tempFolder/src
pathToSource=$courseName

echo "building $courseName ..."

unzip -q "$courseName" -d $tempFolder

npm create vite@latest "$courseName" --template vanilla-ts
cd "$courseName" || exit 1
rm src/*
rm public/*
touch readme.md
echo "# $courseName" > readme.md
cd ..

mv $pathToPublicTemp "$pathToPublic"
mv $pathToSourceTemp "$pathToSource"
mv $tempFolder/package.json $courseName/package.json
mv $tempFolder/vite.config.js $courseName/vite.config.js

rm -r $tempFolder
rm -r "$courseName.zip"
rm $courseName/index.html

cd "$courseName" && npm install

echo "done!"
exit 0
