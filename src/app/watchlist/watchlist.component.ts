import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Watchlist } from '../watchlist';

import { WatchlistService } from '../watchlist.service';

import { DynamicStylerService } from '../dynamic-styler.service';

import * as Datastore from 'nedb';

import * as $ from 'jquery';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
	watchlists: Watchlist[];
  @Output() onWatchlistChange = new EventEmitter<boolean>();

  constructor(private watchList: Watchlist, private watchListService: WatchlistService, private dynamicStylerService: DynamicStylerService) {}

  getWatchlists(): Promise<Watchlist[]> {
  	return new Promise((resolve) => {
	  	this.watchListService.getWatchLists()
	  	.then((val) => {
	  		resolve(this.watchlists = val);
	  	})
  	})
  }

  removeAllWatchlists(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.watchListService.removeAllWatchlists()
      .then((response) => {
        this.watchlists = [];
        resolve(true);
      });
    });
  }

  /* Creates new watchlist
		 @param watchlist: name of a watchlist
  */
  addWatchlist(watchlist: string): Promise<Watchlist> {
    return new Promise<Watchlist>(resolve => {

    	this.watchListService.addWatchList(watchlist)
    	.then((newWatchlist) => {
  	  	this.watchlists.push(newWatchlist); // Add new watchlist in real time

        // Sort watchlists by their names before displaying them
        this.watchlists.sort((a: any, b: any) => {
          return a.watchlist_name == b.watchlist_name ? 0 : +(a.watchlist_name > b.watchlist_name) || -1;
        })

        $('input.new-watchlist').val(''); // Delete value of new watchlist from modal input

        this.emitWatchlistChange();

        resolve(newWatchlist);
    	})

    })
  }

  removeWatchlist(watchlistId: string): Promise<Watchlist[]> {
    return new Promise<Watchlist[]>((resolve) => {

  		this.watchListService.removeWatchlist(watchlistId)
  		.then(() => {
  			this.watchlists = this.watchlists.filter((item: any) => item._id !== watchlistId); // remove watchlist from current list

        this.emitWatchlistChange();

        resolve(this.watchlists);
  		})

    })
  }

  // Emit event each time watchlist gets added or removed
  private emitWatchlistChange(): void {
    this.onWatchlistChange.emit(true);
  }

  activateList(elementId): void {
    this.dynamicStylerService.activateList(elementId);
  }

  ngOnInit(): void {
  	this.getWatchlists()
  	.then(() => {
  	})
  }

}
