
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
	//0x6b7710fa10ecbad15bc44a07f4dee814d06c38fb187fd777d7536250bb638537
	//0x6b7710fa10ecbad15bc44a07f4dee814d06c38fb187fd777d7536250bb638537
	//console.log(chainMarkets);
	//console.log(chainMarkets["0xae24cef089cb9d4f1c27c0378ce5237bc1f4b2d6cd7f3fa57e9a7adf9d34fa95"]);
	//console.log(cacheMarkets["0xae24cef089cb9d4f1c27c0378ce5237bc1f4b2d6cd7f3fa57e9a7adf9d34fa95"]);
	//console.log(cacheMarkets["0x68b6db6ca1228edb06f214f092b12d8a7974cfcdeae1fc39cc1074f8171ee3c3"]);
	//console.log(cacheMarkets["0x6b7710fa10ecbad15bc44a07f4dee814d06c38fb187fd777d7536250bb638537"]);
	//console.log(Object.keys(chainMarkets));


	//console.log(Object.keys(cacheMarkets).length);
	//console.log(chainMarkets == cacheMarkets);
	//console.log("AAAAAAAA"+chainMarkets+"BBBBBBBB");
	//for (var key in chainMarkets){
		//if(chainMarkets.hasOwnProperty(key)){
   // 		chainMarkets[key]=chainMarkets[key];
  		//}
	//}

}

var marketsPerPage = 50;
var numMarkets = parseInt(augur.getNumMarketsBranch(augur.constants.DEFAULT_BRANCH_ID));
var numPages = Math.ceil(numMarkets / Number(marketsPerPage));

var range = new Array(numPages);
for (var i = 0; i < numPages; ++i) {
     range[numPages - i - 1] = i*marketsPerPage;
}
//console.log(numMarkets);
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
			//console.log(marketsInfo);
			for(var key in marketsInfo){
  				if(marketsInfo.hasOwnProperty(key)){
  					//if (key == "0xb184d99a492a24f708ac8104b9e21aaafcf0c44f5212defcdc1ce2bce57a8e8") console.log(offset, numMarketsToLoad);
  					console.log(offset, key);
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

