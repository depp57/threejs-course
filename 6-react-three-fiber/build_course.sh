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

pathToStaticOld=$tempFolder/static
pathToStaticNew=$courseName/public

pathToScriptOld=$tempFolder/src/script.js
pathToScriptNew=$courseName/src/main.ts

pathToCssOld=$tempFolder/src/styles.css
pathToCssNew=$courseName/src/styles.css

echo "building $courseName ..."

unzip -q "$courseName" -d $tempFolder

npm init @vitejs/app "$courseName" --template vanilla-ts
cd "$courseName" || exit 1
npm install
npm install three @types/three
rm src/vite-env.d.ts
touch readme.md
echo "# $courseName" > readme.md

cd ..
if [ -d $pathToStaticOld ]; then
  mv $pathToStaticOld "$pathToStaticNew"
fi

if [ -d $pathToScriptOld ]; then
  mv $pathToScriptOld "$pathToScriptNew"
fi

if [ -d $pathToCssOld ]; then
  mv $pathToCssOld "$pathToCssNew"
fi

rm -r $tempFolder
rm -r "$courseName.zip"

echo "done!"
exit 0
