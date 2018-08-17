#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"

DIST="${DIR}/dist"
BUILD="${DIR}/build"

cd "${DIR}"

rm -rf ${BUILD}
mkdir -p ${BUILD}

cp -r ./src/assets ${BUILD}/
cp -r ./src/css ${BUILD}/
mkdir -p ${BUILD}/js
cat ./src/index.html | grep -v "<script src=\"js/" | grep -v "</html>" | grep -v "</body>" > ${BUILD}/index.html
uglifyjs ./src/js/* > ${BUILD}/js/bundle.js
echo "    <script src='js/bundle.js'></script>" >> ${BUILD}/index.html
echo "  </body>" >> ${BUILD}/index.html
echo "</html>" >> ${BUILD}/index.html

zip decomissioner.zip ${BUILD}
mv decomissioner.zip ${DIST}
