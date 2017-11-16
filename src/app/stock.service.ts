import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Stock } from './stock';

import * as Datastore from 'nedb';

import * as $ from 'jquery';

import { DbService } from './db.service'

@Injectable()
export class StockService {
	db: Datastore;

  constructor(private dbService: DbService, private http: Http) {
  	this.db = this.dbService.getDb();
  }

  /* Adds stock to a watchlist
		 @param watchlistID: id of a watchlist
		 @param stockSymbol: stock symbol representing a stock
		 @param stockShares: number of shares
		 @return stock object we added
  */
  addStock(watchlistId: string, stockSymbol: string, stockShares: string): Promise<Stock> {
  	return new Promise((resolve) => {
	  	this.getStockData(stockSymbol, stockShares) // Get data for stock we are about to add
	  	.then((stock) => {

	  		this.db.find( { _id: watchlistId }, (err, doc: any) => {


	  			// If watchlist has stocks, check if stock we are about to add is already in that watchlist
	  			if (doc[0].stocks.length) {
	  				let stocks = doc[0].stocks.filter(item => { return item.symbol !== stockSymbol; }); // Remove duplicate stock and replace it with new stock data

	  				stocks.push(stock); // Add updated stock data

	  				this.updateStockData(watchlistId, stocks)
	  				.then(() => {
							resolve(stock as Stock);
	  				})
	  			// Add first stock to watchlist
	  			} else {
							this.db.update({ _id: watchlistId }, { $addToSet: { stocks: stock } }, {}, () => { // Set stocks array with new stock
								resolve(stock as Stock);
	  				});
	  			}

	  		})
	  	})
  	})
  }


  /* Update amount of stock shares
		 @param watchlistId: id of a watchlist
		 @param stockSymbol: stock symbol
		 @param stockShares: amount of stock shares
		 @return boolean
  */
  updateShares(watchlistId: string, stockSymbol: string, stockShares: number): Promise<boolean> {

  	return new Promise(resolve => {

	  		this.db.find( { _id: watchlistId }, (err, doc: any) => {

  				// Update stock's number of shares owned value
  				let stocks = doc[0].stocks.filter(item => {
  					item.symbol === stockSymbol ? item['shares_owned'] = stockShares : false;
  					return item;
  				});

  				// Save updated stock data
  				this.updateStockData(watchlistId, stocks)
  				.then(() => {
						resolve(true);
  				})

	  		})

  	})

  }

  /* Calculate price change of a stock
		 @param priceChange: price change in dollars of a stock
		 @return price change rounded to 4 decimal places
  */
  private priceChangeCalculator(priceChange: string): string {
  	let priceChangeInt = parseFloat(priceChange);
  	let priceChangePrepared = priceChangeInt / 100;

  	let priceChangeFinal = priceChangePrepared.toFixed(4);
  	return priceChangeFinal;
  }

	private decimalPlaces(num: number) {
	  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	  if (!match) { return 0; }
	  return Math.max(
	       0,
	       // Number of digits right of decimal point.
	       (match[1] ? match[1].length : 0)
	       // Adjust for scientific notation.
	       - (match[2] ? +match[2] : 0));
	}

  private marketValueCalculator(lastPrice: string, sharesOutstanding: string): string {
  	let lastPriceInt = parseFloat(lastPrice);
  	let sharesOutstandingInt = parseFloat(sharesOutstanding);

  	return (lastPriceInt * sharesOutstandingInt).toString();
  }

  /* Parses stock information organizing it into an object
  	@param stockSymbol: symbol identifying a specific stock
		@param stockInfo: string containing stock data
		@param stockShares: number of shares
  */
  private parseStockData(stockSymbol: string, stockInfo: string, stockShares: string): Stock {
  	let stock = stockInfo.trim().split(',');
  	// Set any number stock property value to blank if it does not contain valid number
  	for (var i = stock.length - 1; i >= 0; i--) {
  		isNaN(parseFloat(stock[i])) ? stock[i] = "" : stock[i];
  	}

  	let priceChange = "";
  	let marketValue = "";

  	// Check stock values have valid numbers before doing calculations
  	if (stock[4] !== "") {
  		priceChange = this.priceChangeCalculator(stock[4]);
  	}
  	if ((stock[1] !== "") && (stock[0] !== "")) {
  		marketValue = this.marketValueCalculator(stock[1], stock[0]);
  	}

  	let stockData = {symbol: stockSymbol, shares_outstanding: stock[0], last_price: stock[1], low: stock[2], high: stock[3], day_change: stock[4],
  									price_change: priceChange, market_value: marketValue, shares_owned: stockShares};

  	return stockData as Stock;
  }

  /* Updates stock data
		 @param watchlistId: id of watchlist
		 @param stocks: array of stock objects
		 @param updateTimestamp: true/false if modified_at should get updated
		 @return boolean
  */
  updateStockData(watchlistId: string, stocks: any, updateTimestamp: boolean = false): Promise<boolean> {
		return new Promise(resolve => {
			stocks = this.orderStocksBySymbol(stocks);
			if (updateTimestamp) {
				this.db.update({ _id: watchlistId }, { $set: { stocks: stocks, modified_at: Date.now() } }, {}, () => { // Set stocks array with new stock
					resolve(true);
				});
			} else {
			this.db.update({ _id: watchlistId }, { $set: { stocks: stocks } }, {}, () => { // Set stocks array with new stock
					resolve(true);
				});
			}

		});
  }

  private orderStocksBySymbol(stocks: any) {
	  stocks.sort((a, b) => {
	    return a.symbol == b.symbol ? 0 : +(a.symbol > b.symbol) || -1;
	  })
	  return stocks;
  }

  /* Gets stock data from Yahoo finance
		 @param stockSymbol: symbol identifying a specific stock
		 @param stockShares: number of shares
		 @return Stock data object
  */
  getStockData(stockSymbol: string, stockShares: string): Promise<Stock> {
    return new Promise(resolve => {
      this.getStockDataFromYahooFinancePage(stockSymbol)
      .then((response: any) => {
        response['shares_owned'] = stockShares;
        resolve(response);
      })
    })
  }

  // Uses jQuery to load HTML and get information about stock from the DOM
   // @return stockData Stock object containing data about stock
  parseStockDataFromYahooFinancePage(htmlBody: any, urlOfHTMLBody: string): Stock {
    htmlBody = $.parseHTML(htmlBody);
    let stockData = {}
    if (urlOfHTMLBody.includes('key-statistics')) {
      stockData['shares_outstanding'] = $(htmlBody).find('td[data-reactid="348"]').text().replace(',', '.');
      stockData['last_price'] = Number($(htmlBody).find('span[data-reactid="35"]').text().replace(/[^0-9\.-]+/g,""));
    } else {
      let stockTable = $(htmlBody).find('#quote-summary'); // DOM element of table with stock data
      stockData['market_value'] = $(stockTable).find('td[data-test="MARKET_CAP-value"]').find('span').text().replace(',', '.');
      let dayRange = $(stockTable).find('td[data-test="DAYS_RANGE-value"]').text().split(' - ');
      if (dayRange.length === 2) {
        stockData['low'] = dayRange[0].replace(',F', '.');
        stockData['high'] = dayRange[1].replace(',', '.');
      } else {
        stockData['low'] = '';
        stockData['high'] = '';
      }
      stockData['day_change'] = $(htmlBody).find('span[data-reactid="37"]').last().text().split('(')[0].trim().replace(',', '.'); // Extract day change in decimal from format: +0.29 (+0.34%)

      let priceChange = this.priceChangeCalculator(stockData['day_change'])

      stockData['price_change'] = priceChange;
    }
    return stockData as Stock;
  }

  /*  Goes to finance.yahoo.com page of a stock and extracts from the DOM
  *   information about that stock
  *   @param stockSymbol acronym for a stock, e.g., MSFT for Microsoft
  *   @return Stock object with data about stock
  */
  getStockDataFromYahooFinancePage(stockSymbol: string): Promise<any> {
    return new Promise(resolve => {
      let urlsToGetDataFrom = [
        `https://finance.yahoo.com/quote/${stockSymbol}?p=${stockSymbol}`,
        `https://finance.yahoo.com/quote/${stockSymbol}/key-statistics?p=${stockSymbol}`
      ]

      var promises = [];
      let stockData = {symbol: stockSymbol}

      urlsToGetDataFrom.forEach((url) => {
        promises.push(
          this.getPageBody(url) // Get HTML of a page
          .then((pageBody) => {
            $.extend(stockData, this.parseStockDataFromYahooFinancePage(pageBody, url)) // merge new object that gets returned from function invocation to our existing one
          })
        )
      })

      Promise.all(promises).then(() => {
        resolve(stockData)
      });

    })
  }

  // Download a page and extract HTML from it
  getPageBody(url: string): Promise<string> {
    return this.http
               .get(url)
               .toPromise()
               .then((response: any) => {
                 return response._body
               })
  }

  getMultipleStockData(stockSymbols: string[], stockShares: string[]): Promise<Stock[]> {
    return new Promise(resolve => {
      var promises = [];
      var stockData = [];
      stockSymbols.forEach((symbol, index) => {

        promises.push(
          this.getStockDataFromYahooFinancePage(symbol)
          .then((response) => {
            response['shares_owned'] = stockShares[index];
            stockData.push(response)
          })
        )

      })

      Promise.all(promises).then(() => {
        resolve(stockData);
      });

    })
  }

  /* Constructs request url of API for collection of stocks
  	 @param stockSymbols: collection of stock symbols
  	 @return request url
  */
  private buildStockDataApiUrl(stockSymbols: string[]): string {
  	let url = "http://download.finance.yahoo.com/d/quotes.csv?s=";
  	let stockOptions = "&f=j2l1ghc1o" // stock options we want to request; add to end of url

  	return url + stockSymbols.join(",") + stockOptions;
  }

  /* Modifies all stock data from every watchlist with newest stock data
  */
  updateAllStocks(): Promise<boolean> {
    return new Promise(resolve => {
    	var promises = [];

    	// Find all watchlists that haven't been updated within the last hour
			this.db.find({}, (err, doc) => {

	      let total = 0;
	      doc.forEach((watchlist) => {
	      	let watchlistDate = new Date(watchlist.modified_at);

	        if (this.lessThanOneHourAgo(watchlist.modified_at) === false) {
		        let stockSymbols = [];
		        let stockShares = [];
		        watchlist.stocks.filter((stock) => { stockSymbols.push(stock.symbol); stockShares.push(stock.shares_owned) }); // Collect symbols and num of shares

		        // Get new stock data from api endpoint and update watchlists
		        promises.push(
			        this.getMultipleStockData(stockSymbols, stockShares)
			        .then((stocks) => this.updateStockData(watchlist._id, stocks, true) )
		        )

	        }

	      });

	      Promise.all(promises).then(() => {
	      	resolve(true);
	      });

	    });
	  });
  }

  private lessThanOneHourAgo(date: any): boolean {
  	const HOUR = 1000 * 60 * 60;
  	let anHourAgo = Date.now() - HOUR;

  	return date > anHourAgo;
  }

}
