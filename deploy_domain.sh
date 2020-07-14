#!/bin/bash

echo Project Name?
read projname
cp -r ThisIsNotACloaker/ $projname/
cd $projname
echo Project Port for safe?
read projport
echo Project Port for money?
read projports
sed -i 's/5000/$projport/g' index.js
sed -i 's/5500/$projports/g' index.js


# Result will be cloaker-XXXXXXXX.vercel.app or .now.sh or .nfcurti.now.sh
# use cloaker-XXXXXX.now.sh by replacing the XXXX with the hash returned from the callback