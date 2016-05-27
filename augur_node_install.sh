#!/bin/bash


function error_exit
{
	echo "$1" 1>&2
	#exit 1
}

####################
# Intsall Geth if not already installed
####################
command -v geth >/dev/null 2>&1 || {
	time sudo apt-get install -y software-properties-common
	time sudo add-apt-repository -y ppa:ethereum/ethereum
	time sudo add-apt-repository -y ppa:ethereum/ethereum-dev
	time sudo apt-get update
	time sudo apt-get install -y ethereum
}

####################
# If geth is running, kill it (with permission)
# An augur node will manage geth.
####################
gethPID=`ps -eaf | grep geth | grep -v grep | awk '{print $2}'`
if [[ "" != "$gethPID" ]]; then
	echo "Looks like geth is already running. augur_node manages geth for you"
	read -p "Can we restart geth? " -n 1 -r
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]
	then
		echo "killing geth"
		#kill -9 $gethPID
		#echo "thanks!"
	else
		error_exit  "augur_node requires you to let it manage geth. Abort!"
	fi
fi

echo $SUDO_USER


#--check if geth already running. if so, prompt to kill it.
#--download geth.conf, modify it, start it
#--download ui build files, install in bin
#--download augur_node.conf, start it.
