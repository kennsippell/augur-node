#!/bin/bash

set -x

echo "starting augur_node update"

HOMEDIR="/home/$USER"


#####################
# Stop services
#####################
sudo stop augur_node
sudo stop geth

#####################
# Install latest augur_node
#####################
cd $HOMEDIR/augur_node
rm -rf node_modules
npm cache clear
git pull origin master
npm install
rm -rf data/augur_cache_db

#####################
# Restart serrvices
#####################
sudo start geth
#augur_node gets started automatically

echo "finished augur_node update"