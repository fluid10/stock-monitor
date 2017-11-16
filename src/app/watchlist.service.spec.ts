import { TestBed, inject, async } from '@angular/core/testing';

import { WatchlistService } from './watchlist.service';

import { DbService } from './db.service';

import * as Datastore from 'nedb';

describe('WatchlistService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchlistService, DbService]
    });

    service = TestBed.get(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a watchlist', (done) => {
  	let watchlistName = 'Tractors';
  	
  	return service.addWatchList(watchlistName)
  	.then((result: any) => {
  		expect(result.watchlist_name).toEqual(watchlistName);
  		done();
  	});
  });

  it('should remove a watchlist', (done) => {

  	let watchlistId = 'testId';

		service.removeWatchlist(watchlistId)
		.then((numRemoved) => {
			expect(numRemoved).toBeGreaterThanOrEqual(0);
			done();
		});


  });

  it('should get a watchlist', (done) => {

  	service.addWatchList('TestWatchlist')
  	.then((data: any) => {
  		let watchlistId = data._id;

  		service.getWatchList(watchlistId)
  		.then((watchlist: any) => {
  			expect(watchlist.watchlist_name).toEqual('TestWatchlist');

  			service.removeWatchlist(watchlistId)
  			.then(() => {
  				done();
  			});

  		});

  	})

  })


});
