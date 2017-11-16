import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { WatchlistService } from '../watchlist.service';
import { Watchlist } from '../watchlist';

import { StockService } from '../stock.service';

import 'rxjs/add/operator/switchMap';

import * as $ from 'jquery';

@Component({
  selector: 'app-watchlist-detail',
  templateUrl: './watchlist-detail.component.html',
  styleUrls: ['./watchlist-detail.component.css']
})
export class WatchlistDetailComponent implements OnInit, OnChanges {
  @Input() newstock: any;
	watchlist: Watchlist;
  stockSymbol: string;
  stockShares: number;
  totalShares: number;
  totalMarketValue: number;
  totalDayChange: string;


  constructor(
  	private watchlistService: WatchlistService,
    private stockService: StockService,
  	private route: ActivatedRoute,
  	private location: Location
  ) { }

  getWatchList(id: string): Promise<Watchlist> {
    return new Promise<Watchlist>(resolve => {
      if ((id) && (id !== 'false')) {
        this.watchlistService.getWatchList(id).then((doc) => resolve(doc) )
      } else {
        resolve(this.watchlist);
      }
    })
  }

  updateModal(stock: any): void {
    this.stockSymbol = stock.symbol;
    this.stockShares = stock.shares_owned;
  }

  updateShares(watchlistId: string, stockSymbol: string, stockShares: number): Promise<boolean> {
    return new Promise(resolve => {

      this.stockService.updateShares(watchlistId, stockSymbol, stockShares)
      .then(() => { this.ngOnInit(); resolve(true) });

    })
  }

  /* Removes company from a watchlist
  */
  removeCompany(watchlistId: string, stockSymbol: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {

      this.watchlistService.removeCompany(watchlistId, stockSymbol)
      .then(response => {
        resolve(response)
        this.ngOnInit();
      });

    })
  }

  /* Checks if argument value is a number
     @param value: any value
  */
  isNumber(value: any): boolean {
    value = parseFloat(value);
    return typeof(value) === 'number' ? !isNaN(value) : false; // If converted value is of type number and is not NaN value is a valid number
  }

  /* Marks each cell with appropriate class depending whether change is positive or negative (for css styling)
     Returns absolute value of day change
     @param stockSymbol: symbol of stock; used to identify correct cell
     @param value: day change value
     @return absolute value of day change
  */
  formatDayChange(stockSymbol: string, value: string): number {
    let dayChange = parseFloat(value);
    if (dayChange >= 0) {
      $('td#' + stockSymbol + '-day-change').attr('class', 'text-success');
    } else {
      $('td#' + stockSymbol + '-day-change').attr('class', 'text-danger');
    }
    dayChange = Math.abs(dayChange);
    return dayChange;
  }

  formatPriceChange(stockSymbol: string, value: number): number {
    if (value >= 0) {
      $('td#' + stockSymbol + '-price-change').attr('class', 'text-success');
    } else {
      $('td#' + stockSymbol + '-price-change').attr('class', 'text-danger');
    }

    return value;
  }

  formatLastPrice(stockSymbol: string, value: number, priceChange: number): number {
    if (priceChange >= 0) {
      $('td#' + stockSymbol + '-last-price').attr('class', 'bg-success');
    } else {
      $('td#' + stockSymbol + '-last-price').attr('class', 'bg-danger');
    }

    return value;

  }

  private formatTotalDayChange(value: string): number {
    let valueToInt = parseFloat(value);
    if (valueToInt >= 0) {
      $('td#total-day-change').attr('class', 'text-success');
    } else {
      $('td#total-day-change').attr('class', 'text-danger');
    }

    return Math.abs(valueToInt);
  }

  /* Calculates number of total shares in a watchlist
     @param watchlist: watchlist object
     @return total shares in a watchlist
  */
  public totalSharesCalculator(watchlist: any): number {
    let total = 0;

    if (watchlist) {
      watchlist.stocks.map((stock) => {
        total += parseInt(stock.shares_owned);
      });
    }

    return total;
  }

  public totalMarketValueCalculator(watchlist: any): number {
    let total = 0;
    let numberSizes = {"M": 1000000, "B": 1000000000, "T": 1000000000000};
    let numberToMultiplyWith = 0;
    if (watchlist) {
      watchlist.stocks.map((stock) => {
        if (this.isNumber(stock.market_value)) {
          let numberSize = stock.market_value[stock.market_value.length - 1];
          numberSize = numberSizes[numberSize];

          if (numberSize) {
            if (numberToMultiplyWith < numberSize) {
              numberToMultiplyWith = numberSize;
            }
          }

          total += parseFloat(stock.market_value);
        }
      });
    }

    if (numberToMultiplyWith > 0) {
      return total * numberToMultiplyWith;
    } else {
      return total;
    }

  }

  public totalDayChangeCalculator(watchlist: any): string {
    let total = 0;

    if (watchlist) {
      watchlist.stocks.map((stock) => {
        if (this.isNumber(stock.day_change)) {
          total += parseFloat(stock.day_change);
        }
      });
    }

    return total.toFixed(2);
  }

  ngOnInit(): void {
  	this.route.paramMap
  		.switchMap((params: ParamMap) => this.getWatchList(params.get('id')))
  		.subscribe((watchlist: any) => {
        this.totalShares = this.totalSharesCalculator(watchlist);
        this.totalMarketValue = this.totalMarketValueCalculator(watchlist);
        this.totalDayChange = this.totalDayChangeCalculator(watchlist);

        this.watchlist = watchlist;
      } );
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) { // Update stock list in real time each time a company gets added
    this.ngOnInit();
  }

}
