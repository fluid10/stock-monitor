import { Component, OnInit } from '@angular/core';

import { WatchlistService } from '../watchlist.service';

import { StockService } from '../stock.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
	totalMarketValue: number;
	totalDayChange: number;
	marketValueByWatchlist: any;
	dayChangeByWatchlist: any;
	portfolioDataFetched: boolean;
  portfolioEmpty: boolean;
  public doughnutChartLabels:string[] = [];
  public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';
  public tooltipConfig = {tooltips: {enabled: false}};

  public barChartLabels:string[] = [];
  public barChartType:string = 'bar';
  public barChartData:any[] = [{data: [], label: ''}];
  public barChartLegend:boolean = false;

  constructor(private watchlistService: WatchlistService, private stockService: StockService) { }

  getPortfolioOverviewData(): Promise<any> {
  	return new Promise<any>(resolve => {

  		this.watchlistService.getPortfolioOverviewData()
  		.then(data => {
  			resolve(data);
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

  /* Sets appropriate color of HTML element depending on value of day change
     @param value: total day change value
     @return absolute value of total day change
  */
  formatPortfolioTotalDayChange(value: string): number {
    let dayChange = parseFloat(value);

    if (dayChange < 0) {
      $('div#portfolio-total-day-change').attr('class', 'card-body text-danger');
    } else {
      $('div#portfolio-total-day-change').attr('class', 'card-body text-success');
    }

    return Math.abs(dayChange);
  }

  ngOnInit() {

    this.stockService.updateAllStocks()
    .then((response) => {

      this.getPortfolioOverviewData() // Get data for portfolio overview display
      .then((data) => {
        this.portfolioDataFetched = true; // Mark data as fetched

    		this.totalMarketValue = data['total_market_value'];
    		this.totalDayChange = data['total_day_change'];
    		this.marketValueByWatchlist = data['market_value_by_watchlist'];
    		this.dayChangeByWatchlist = data['day_change_by_watchlist'];

    		// Add total market value of watchlist to chart data
    		this.marketValueByWatchlist.forEach((watchlist) => {

    			if (watchlist.total_market_value) {
  	  			this.doughnutChartLabels.push(watchlist.watchlist_name);
  	  			this.doughnutChartData.push(watchlist.total_market_value);
    			}

    		})

    		// Add total day change value of watchlist to chart data
    		this.dayChangeByWatchlist.forEach((watchlist) => {

    			if (watchlist.total_day_change) {
  	  			this.barChartLabels.push(watchlist.watchlist_name);
  	  			this.barChartData[0].data.push(watchlist.total_day_change);
    			}

    		})

        this.totalMarketValue === 0 ? this.portfolioEmpty = true : this.portfolioEmpty = false;

      });


    });


  }

}
