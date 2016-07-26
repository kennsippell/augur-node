
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



function marketsInfoEqual(chainMarkets, cacheMarkets){
	console.log(chainMarkets == cacheMarkets);
}

var marketsPerPage = 50;
var numMarkets = parseInt(augur.getNumMarketsBranch(augur.constants.DEFAULT_BRANCH_ID));
var numPages = Math.ceil(numMarkets / Number(marketsPerPage));

var range = new Array(numPages);
for (var i = 0; i < numPages; ++i) {
     range[numPages - i - 1] = i*marketsPerPage;
}
console.log(numMarkets);
var markets = {};

async.forEachOfSeries(range, (offset, index, next) => {
	var numMarketsToLoad = (index === 0) ? numMarkets - range[index] : marketsPerPage;
	augur.getMarketsInfo({
		branch: augur.constants.DEFAULT_BRANCH_ID,
		offset: offset,
		numMarketsToLoad: numMarketsToLoad,
		callback: function (marketsInfo) {
			if (!marketsInfo || marketsInfo.error) return next(marketsInfo || "getMarketsInfo");
			//console.log(marketsInfo);
			for(var key in marketsInfo){
  				if(marketsInfo.hasOwnProperty(key)){
    				markets[key]=marketsInfo[key];
  				}
			}
			next();
		}
	});
}, (err) => {
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  			marketsInfoEqual(JSON.stringify(markets), body);
		}
	});
});

