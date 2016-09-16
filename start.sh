#!/bin/bash

cd /home/augur
npm install

while ! curl http://elasticsearch:9200; do sleep 1; done;

node index.js
