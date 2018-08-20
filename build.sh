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
rm -rf ${DIST}
mkdir -p ${BUILD}
mkdir -p ${DIST}

mkdir -p ${BUILD}/css
uglifycss ./src/css/* > ${BUILD}/css/game.css

mkdir -p ${BUILD}/js
uglifyjs ./src/js/utils.js \
  ./src/js/audio.js \
  ./src/js/player.js \
  ./src/js/seed-words.js \
  ./src/js/word-generator.js \
  ./src/js/htmlize.js \
  ./src/js/svg.js \
  ./src/js/screen-transition.js \
  ./src/js/splash.js \
  ./src/js/terminal.js \
  ./src/js/endscreen.js \
  ./src/js/dialogue.js \
  ./src/js/subject.js \
  ./src/js/subject-list.js \
  ./src/js/subject-factory.js \
  ./src/js/subject-manager.js \
  ./src/js/main.js -c > ${BUILD}/js/all.js
echo "(function() {" > ${BUILD}/js/bundle_w.js
cat ${BUILD}/js/all.js >> ${BUILD}/js/bundle_w.js
echo "})();" >> ${BUILD}/js/bundle_w.js
cat ${BUILD}/js/bundle_w.js | tr -d '\n' > ${BUILD}/js/all.js
rm ${BUILD}/js/bundle_w.js

cat ./src/index.html | grep -v "<script src=\"js/" | grep -v "</html>" | grep -v "</body>" > ${BUILD}/index_raw.html
echo "    <script src='js/all.js'></script>" >> ${BUILD}/index_raw.html
echo "  </body>" >> ${BUILD}/index_raw.html
echo "</html>" >> ${BUILD}/index_raw.html
cat ${BUILD}/index_raw.html | sed 's/\s\s*/ /' | tr -d '\n' > ${BUILD}/index.html
rm ${BUILD}/index_raw.html

cd ${BUILD}
zip -r ${DIST}/analyser.zip .
cd ${DIR}
# rm -rf ${BUILD}

size=`du -b dist/analyser.zip | awk '{print $1}'`
leftover=$((size - 13312))
if [[ $((size - 13312)) -gt 0 ]]; then
  echo -e "\e[93m\e[1m[WARNING] TOO BIG! File size is ${size}. You need to lose $leftover bytes.\e[39m"
else
  echo -e "\e[92m\e[1m[SUCCESS] File size under 13312 bytes: ${size}. You have $((-leftover)) bytes left.\e[39m"
fi
