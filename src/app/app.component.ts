import { Component, Input, OnInit } from '@angular/core';

import { CompanySearchComponent } from './company-search.component';

import { WatchlistComponent } from './watchlist/watchlist.component';
import { Watchlist } from './watchlist';
import { WatchlistService } from './watchlist.service';

import { DynamicStylerService } from './dynamic-styler.service';

import * as Datastore from 'nedb';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit  {
	name = 'Angular';
	watchlists: Watchlist[];

  constructor(private watchList: Watchlist, private watchListService: WatchlistService, private dynamicStylerService: DynamicStylerService) {}

  getWatchlists(): Promise<Watchlist[]> {
  	return new Promise((resolve) => {
	  	this.watchListService.getWatchLists()
	  	.then((val) => {
	  		resolve(this.watchlists = val);
	  	})
  	})
  }

  activateList(elementId): void {
    this.dynamicStylerService.activateList(elementId);
  }

  /* Any time a watchlist gets added/removed, update list of watchlists in navbar
  */
  onWatchlistChange() {
    this.getWatchlists();
  }

  ngOnInit(): void {
  	this.getWatchlists()
  	.then(() => {
  	})
  }

}
