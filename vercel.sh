#!/bin/bash

if [[ $VERCEL_ENV == "production"  ]] ; then
  yarn build
else
  yarn build --mode staging
fi
