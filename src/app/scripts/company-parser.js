/*

Parses company data from indexes and writes them to a file

*/

"use strict";
var parse = require("csv-parse");
var fs = require("fs");

async function companyParser() {

  var indexFile = [];
  var indexes = ['./amex.csv', './nasdaq.csv', './nyse.csv'];
  var data = [];

  for (let index of indexes) {

	  fs.createReadStream(index)
      .pipe(parse({ delimiter: ',' }))
      .on('data', function (csvRow) {
	      let company = {symbol: csvRow[0], name: csvRow[1],
	      	sector: csvRow[5], industry: csvRow[6]};

	      data.push(company);
  
		  })
      .on('end', function() {
      	
      	// Output file with all the companies after we read all indexes
      	if (index === indexes[indexes.length - 1]) {

          // Sort companies by their symbol
          data.sort(function(a, b) {
            return (a.symbol < b.symbol) ? -1 : (a.symbol > b.symbol) ? 1 : 0;
          });

          data.sort();

					fs.writeFile('companies.json', JSON.stringify(data, null, 2), function (err) {
					  console.log(err);
					});
      	}
      
      })

  }
	
}

companyParser();

