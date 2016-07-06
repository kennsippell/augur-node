#!/bin/bash

function error_exit
{
	echo "$1" 1>&2
	exit 1
}

setup() {

AUGURUSER=$SUDO_USER
HOMEDIR="/home/$AUGURUSER"

cd $HOMEDIR

####################
# Intsall Geth if not already installed
####################
command -v geth >/dev/null 2>&1 || {
	time sudo apt-get install -y software-properties-common
	time sudo add-apt-repository -y ppa:ethereum/ethereum
	time sudo apt-get update
	time sudo apt-get install -y ethereum
}

####################
# If geth is running, kill it (with permission)
# An augur node will manage geth.
####################
gethPID=`ps -eaf | grep geth | grep -v grep | awk '{print $2}'`
if [[ "" != "$gethPID" ]]; then
	echo "Looks like geth is already running. augur_node manages geth for you."
	read -p "Can we restart geth? " -n 1 -r
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]
	then
		echo "killing geth"
		kill -9 $gethPID
	else
		error_exit  "augur_node requires you to let it manage geth. Abort!"
	fi
fi

####################
#Create geth account (if there isn't one)
####################
accounts=`sudo -u $AUGURUSER -i geth --testnet account list`
if [[ "" == $accounts ]]; then
	echo "Please set up a geth account."
	sudo -u $AUGURUSER -i geth --testnet account new
fi

####################
#Install augur_node service
####################
sudo -u $AUGURUSER wget https://raw.githubusercontent.com/AugurProject/augur_node/master/augur_node.conf
sudo -u $AUGURUSER sed -i "s/augur_node_user/$AUGURUSER/g" augur_node.conf
sudo -u $AUGURUSER sed -i "s|augur_node_pwd|$HOMEDIR/marketeer|g" augur_node.conf
cp augur_node.conf /etc/init/

####################
#Install and Start geth service
####################
sudo -u $AUGURUSER wget https://raw.githubusercontent.com/AugurProject/augur_node/master/geth.conf
sudo -u $AUGURUSER sed -i "s/augur_node_user/$AUGURUSER/g" geth.conf
cp geth.conf /etc/init/
start geth

####################
#Install nodejs
####################
time curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
time sudo apt-get install -y nodejs

####################
#Install marketeer
####################
#time sudo apt-get -y install git build-essential
#sudo -i -u $AUGURUSER git clone https://github.com/AugurProject/marketeer.git
#sudo -i -u $AUGURUSER  bash -c "cd marketeer; npm install"


####################
#IStart augur_node service
####################
#start augur_node

}

##Wait to call setup until full file downloaded.
setup



