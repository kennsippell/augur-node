#!/bin/bash

cd /home/augur

while ! curl http://elasticsearch:9200; do sleep 1; done;
while ! curl http://geth:8545; do sleep 1; done;

node index.js
