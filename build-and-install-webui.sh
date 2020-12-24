#!/bin/sh

npm --prefix webui run build && \
rm -rf api/public && \
mkdir api/public &&
cp -r webui/build/* api/public/