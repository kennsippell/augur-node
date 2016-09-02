# augur_node
An Augur Node is a public node that caches/serves market data to help with performance. The integrity of data served from an Augur Node can be quickly verified in a client by comparing a hash of the data returned to the hash stored on chain.

To setup a node, run this command:

```sudo bash -c "$(curl -s https://raw.githubusercontent.com/AugurProject/augur_node/master/augur_node_install.sh)"```

This will install geth if it isn't already installed and set up the cache server. If geth is already running you will be prompted to let augur_node restart it, as it is a requirement that an augur_node manages geth for you.

When setup is complete, you will be left with two services: `geth` and `augur_node` which will be started/stopped on startup/shutdown.

If you are setting this up on a new machine there will be a delay between when you installation is complete and when your cache server is available while augur_node waits for your blockchain to finish syncing. You can check the progress of this by doing: 
```sudo cat /var/log/upstart/augur_node.log```

You can test that your augur_node is working by navigating to `http://your_server:8547/getMarketsInfo` in your browser.

An augur_node does not manage your networking for you, so please verify that ports 8545 (geth rpc), 8546 (geth websockets), 8547 (augur_node) are open on your machine.

# endpoints
Your cache node will have the following endpoints available:

`http://your_server:8547/getMarketsInfo?branchId=eq,branch` You can continue to filter your results in this way, in the format field=op,value.
So for example:

`http://your_server:8547/getMarketsInfo?branchId=eq,1010101&volume=gt,0&tradingFee=lte,.02`

`http://your_server:8547/batchGetMarketInfo?ids=id1,id2,id3...`

`http://your_server:8547/getMarketInfo?id=id`

`http://your_server:8547/getMarketPriceHistory?id=id&toBlock=blocknum&fromBlock=blocknum` (to/fromBlock params are optional).

`http://your_server:8547/getAccountTrades?id=id&toBlock=blocknum&fromBlock=blocknum` (to/fromBlock params are optional).

# Updates
To update your augur_node, run this from the command line:
```
curl -sL https://raw.githubusercontent.com/AugurProject/augur_node/master/augur_node_update.sh | bash
```
