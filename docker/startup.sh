#!/bin/sh

cd /usr/share/nginx/html/assets
files=$(ls)
for file in $files
do
  cp $file /tmp/$file
  rm $file
  envsubst '${VITE_SME_CDEP_API}' < /tmp/$file > $file
done

nginx -g 'daemon off;'