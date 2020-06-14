#!/bin/bash

# First we install our dependencies (including now, vercel and the request packages)
npm install

# Now we deploy our URL
# If we get asked by Zeit Now if we want to use a brand new project or fork another one
# Just use the default which is cloaker.now.sh
# Project naming occurs just once the first time you deploy
vercel

# Result will be cloaker-XXXXXXXX.vercel.app or .now.sh or .nfcurti.now.sh
# use cloaker-XXXXXX.now.sh by replacing the XXXX with the hash returned from the callback