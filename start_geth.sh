#!/bin/bash
pwd
#geth requires an account to operate. create one if one doesn't exist
#accounts=`./geth --testnet account list`
#echo $accounts
#if [[ "" == $accounts ]]; then
	echo "Creating new geth account"
	pw=`< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-16};echo;`
	echo $pw > pw.txt
	./geth --testnet --password pw.txt account new
#fi
echo "starting geth"
./geth --testnet --fast --rpcaddr "0.0.0.0" --rpc --rpccorsdomain "*" --rpcapi "eth,net,web3,txpool" --ws --wsapi "eth,net,web3,txpool" --wsport 8546 --wsorigins "*"
