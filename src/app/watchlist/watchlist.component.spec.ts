import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { WatchlistComponent } from './watchlist.component';

import { WatchlistService } from '../watchlist.service';

import { DbService } from '../db.service';

import { Watchlist } from '../watchlist';

describe('WatchlistComponent', () => {
  let component: WatchlistComponent;
  let fixture: ComponentFixture<WatchlistComponent>;
  let watchlists: Watchlist[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchlistComponent ],
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [ WatchlistService, Watchlist, {provide: APP_BASE_HREF, useValue: '/'}, DbService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove all watchlists', (done) => {
    component.removeAllWatchlists()
    .then((response) => {
      expect(component.watchlists).toEqual([]);
      done();
    });
  });

  it('should add a watchlist', (done) => {
    component.addWatchlist('Just a Watchlist')
    .then((watchlist) => {
      expect(component.watchlists).not.toEqual([]);
      done();
    });
  });

  it('should get all watchlists', (done) => {
    component.getWatchlists()
    .then((allWatchlists) => {
      expect(allWatchlists).toBeDefined();
      watchlists = allWatchlists; // Watchlist object for use in tests below
      done();
    });
  });

  it('should remove a watchlist', (done) => {
    component.watchlists = watchlists;
    let watchlistId = watchlists[0]['_id'];
    component.removeWatchlist(watchlistId)
    .then((watchlists) => {
      expect(component.watchlists).toEqual([]);
      done();
    });
  });

});
