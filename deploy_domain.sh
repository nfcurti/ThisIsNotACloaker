#!/bin/bash

#First we install our dependencies (including now, vercel and the request packages)
npm install

#Now we deploy our URL
vercel

#Result will be cloaker-XXXXXXXX.vercel.app or .now.sh or .nfcurti.now.sh
#use cloaker-XXXXXX.now.sh by replacing the XXXX with the hash returned from the callback