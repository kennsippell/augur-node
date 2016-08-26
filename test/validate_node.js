
var request = require('request');
var augur = require("augur.js");
var async = require("async");
var assert = require("chai").assert;

var config = {
    http: "http://localhost:8545",
    ws: "ws://localhost:8546",
}

augur.connect(config);

var args = process.argv.slice(2);
var port = "8547";
var node = "http://augurnode.eastus.cloudapp.azure.com:8547";
var TIMEOUT = 60000;

function sameIds(chain, cache){
	var same = true;
	for (var key in chain){
		if (!cache.hasOwnProperty(key)){
			same = false;
			console.log(key, "on chain, not in cache");
		}
	}
	for (var key in chain){
		if (!cache.hasOwnProperty(key)){
			same = false;
			console.log(key, "in cache, not on chain");
		}
	}
	return same;
}

function marketsInfoEqual(chain, cache){
	var same = true;
	for (var key in chain){
		if(chain.hasOwnProperty(key)){
			var chainMarket = chain[key];
			var cacheMarket = cache[key];

			for (var prop in cacheMarket){
				if(cacheMarket.hasOwnProperty(prop)){
					same = false;
					if (chainMarket[prop].constructor == Array) continue;
					if (cacheMarket[prop] != chainMarket[prop]){
						console.log(key, prop, "chain:", chainMarket[prop], "cache:", cacheMarket[prop]);
					}
				}
			}
		}
	}
	return same;
}

/*
describe("marketInfo", function () {
	it("matches data on chain", function (done) {
		this.timeout(TIMEOUT);
		var url = node + "/getMarketsInfo";
		request(url, function (error, response, body) {
			assert.isNull(error);
			assert.deepEqual(response.statusCode, 200);
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
			  		assert.isTrue(sameIds(markets, cacheMarkets));
			  		assert.isTrue(marketsInfoEqual(markets, cacheMarkets));
					done();
			});
		});
	});
});


describe("priceHistory", function () {
	it("matches data on chain", function (done) {
		this.timeout(TIMEOUT);

		var markets = augur.getMarketsInBranch(augur.constants.DEFAULT_BRANCH_ID);
		async.each(markets, function (id, nextMarket){
			var chainHistory = augur.getMarketPriceHistory(id);
			if (chainHistory == null){
				nextMarket();
				return;
			}
			var url = node + "/getMarketPriceHistory?id=" + id;
			request(url, function (error, response, body) {
				assert.isNull(error);
				assert.deepEqual(response.statusCode, 200);
		  		var cacheHistory = JSON.parse(body);
		  		assert.deepEqual(JSON.stringify(chainHistory), JSON.stringify(cacheHistory));
		  		nextMarket();
		  	});		
		}, (err) => {
			assert.isNull(err);
			done();
		});
	});
});
*/

describe("getMarketInfo", function () {
	it("matches data on chain", function (done) {
		this.timeout(TIMEOUT);

		var markets = augur.getMarketsInBranch(augur.constants.DEFAULT_BRANCH_ID);
		async.each(markets, function (id, nextMarket){
			var chainHistory = augur.getMarketInfo(id);
			if (chainHistory == null){
				nextMarket();
				return;
			}
			var url = node + "/getMarketInfo?id=" + id;
			request(url, function (error, response, body) {
				assert.isNull(error);
				assert.deepEqual(response.statusCode, 200);
		  		var cacheHistory = JSON.parse(body);
		  		console.log(chainHistory);
		  		console.log(cacheHistory);
		  		assert.deepEqual(JSON.stringify(chainHistory), JSON.stringify(cacheHistory));
		  		nextMarket();
		  	});		
		}, (err) => {
			assert.isNull(err);
			done();
		});
	});
});






