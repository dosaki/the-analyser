#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"

NR="$1"
words=`ls /usr/bin | cat | grep -x '.\{6,99\}' | sort -R | tail -$NR | sort | sed -e 's/.*/"&",/'`

echo "var LINUX_WORDS = [${words::-1}];" > "$DIR/src/js/seed-words.js"
