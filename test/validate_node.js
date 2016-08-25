
var request = require('request');
var augur = require("augur.js");
var async = require("async");

var config = {
    http: "http://localhost:8545",
    ws: "ws://localhost:8546",
}

augur.connect(config);

var args = process.argv.slice(2);
var port = "8547";
var url = "http://" + args[0] + ":" + port + "/getMarketsInfo";

console.log(url);

function sameIds(chain, cache){
	for (var key in chain){
		if (!cache.hasOwnProperty(key)){
			console.log(key, "on chain, not in cache");
		}
	}
	for (var key in chain){
		if (!cache.hasOwnProperty(key)){
			console.log(key, "in cache, not on chain");
		}
	}
}

function marketsInfoEqual(chain, cache){
	for (var key in chain){
		if(chain.hasOwnProperty(key)){
			var chainMarket = chain[key];
			var cacheMarket = cache[key];

			for (var prop in cacheMarket){
				if(cacheMarket.hasOwnProperty(prop)){
					if (chainMarket[prop].constructor == Array) continue;
					if (cacheMarket[prop] != chainMarket[prop]){
						console.log(key, prop, "chain:", chainMarket[prop], "cache:", cacheMarket[prop]);
					}
				}
			}
		}
	}
}

request(url, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
  		var cacheMarkets = JSON.parse(body);

		var marketsPerPage = 50;
		var numMarkets = parseInt(augur.getNumMarketsBranch(augur.constants.DEFAULT_BRANCH_ID));
		var numPages = Math.ceil(numMarkets / Number(marketsPerPage));

		var range = new Array(numPages);
		for (var i = 0; i < numPages; ++i) {
		     range[numPages - i - 1] = i*marketsPerPage;
		}
		var markets = {};
		console.log("numMarkets", numMarkets);
		async.forEachOfSeries(range, (offset, index, next) => {
			var numMarketsToLoad = (index === 0) ? numMarkets - range[index] : marketsPerPage;
			console.log("offset:", offset);
			augur.getMarketsInfo({
				branch: augur.constants.DEFAULT_BRANCH_ID,
				offset: offset,
				numMarketsToLoad: numMarketsToLoad,
				callback: function (marketsInfo) {
					if (!marketsInfo || marketsInfo.error) return next(marketsInfo || "getMarketsInfo");
					for(var key in marketsInfo){
		  				if(marketsInfo.hasOwnProperty(key)){
		    				markets[key]=marketsInfo[key];
		  				}
					}
					next();
				}
			});
		}, (err) => {
		  		sameIds(markets, cacheMarkets);
		  		marketsInfoEqual(markets, cacheMarkets);
		});
	}
});





