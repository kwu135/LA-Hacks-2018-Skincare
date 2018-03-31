/**
 * Scrapes single website for cosmetic ingredient information and ratings
 */

const fs = require('fs');
var request = require('request');
var _ = require('lodash/core');
var htmlToJson = require('html-to-json');

var baseUrl = __dirname + '/cosmetics.html';

// Remote
// var promise = htmlToJson.request(baseUrl, {
//   'images': ['img', function ($img) {
//     return $img.attr('src');
//   }]
// }, function (err, result) {
//   console.log(result);
// });

// Local
var encoding = "utf8";
var htmlToParse = fs.readFileSync(baseUrl,encoding);

// var json = htmlToJson.parse(htmlToParse, {
//   'cosmetics': function ($doc) {
//     return $doc.find('div').text();
//   }
// }, function (err, result) {
//   console.log(result);
// });

htmlToJson.parse(htmlToParse, function () {
	return this.map('.ingredient-name', function ($item) {
		var name = $item.text();
		name = name.replace(/[\W_]+/g, "");
		return name;
	});
}).done(function (items) {
	htmlToJson.parse(htmlToParse, function() {
		return this.map('.ingredient-rating', function($rating) {
			var rating = $rating.text();
			rating = rating.replace(/[\W_]+/g, "");
			return rating;
		}).done(function(ratings) {
			var data = {};
			for(var i=0; i<items.length; i++) {
				data[items[i]] = ratings[i];
			}
			console.log(data);
		});
	})
}, function(err) {
	console.error("Error occured parsing names: " + err);
});