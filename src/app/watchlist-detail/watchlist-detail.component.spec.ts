import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, Data } from '@angular/router';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule }    from '@angular/http';
import { Observable }        from 'rxjs/Observable';

import { WatchlistDetailComponent } from './watchlist-detail.component';

import { WatchlistComponent } from '../watchlist/watchlist.component';

import { Watchlist } from '../watchlist';

import { MoneyAbbreviatePipe } from '../money-abbreviate.pipe';

import { WatchlistService } from '../watchlist.service';

import {APP_BASE_HREF} from '@angular/common';

import { DbService } from '../db.service';

import { StockService } from '../stock.service';

import * as Datastore from 'nedb';

describe('WatchlistDetailComponent', () => {
  let component: WatchlistDetailComponent;
  let fixture: ComponentFixture<WatchlistDetailComponent>;
  let service;
  let newstock;
  let watchlistId: string;
  let stockSymbol: string;
  let sharesOwned: number;
  let params: any;
  let db: Datastore;

  beforeEach((done) => {
    let dbService = new DbService();
    db = dbService.getDb();

    db.insert({watchlist_name: 'Just a test watchlist', stocks: [{symbol: 'AAPL', shares_owned: 100}]}, (err, doc: any) => {
      watchlistId = doc._id;
      stockSymbol = doc.stocks[0].symbol;
      sharesOwned = doc.stocks[0].shares_owned;
      done();
    })
  })

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ WatchlistDetailComponent, WatchlistComponent, MoneyAbbreviatePipe ],
      imports: [
        RouterModule.forRoot([]),
        HttpModule
      ],
      providers: 
      [ WatchlistService, {provide: APP_BASE_HREF, useValue: '/'}, DbService, StockService, Watchlist
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get watchlist', (done) => {

    component.getWatchList(watchlistId)
    .then((watchlist) => {
      expect(watchlist).not.toEqual({});
      done();
    });

  });

  it('should update amount of shares', (done) => {

    component.updateShares(watchlistId, stockSymbol, 200)
    .then(response => {
      expect(response).toEqual(true);
      done();
    });
  });

  it('should update modal with current selected stock', () => {
    let stockStub = {symbol: 'MSFT', shares_owned: 1500};

    component.updateModal(stockStub);

    expect(component.stockSymbol).toEqual('MSFT');
    expect(component.stockShares).toEqual(1500);
  });

  it('should calculate total shares a watchlist has', () => {
    let watchlistStub = {watchlist_name: 'Just a test watchlist', stocks: [{symbol: 'AAPL', shares_owned: 100}, {symbol: 'MSFT', shares_owned: 100}]};

    let result = component.totalSharesCalculator(watchlistStub);

    expect(result).toEqual(200);
  });

  it('should calculate total market value of stocks that a watchlist has', () => {
    let watchlistStub = {watchlist_name: 'Just a test watchlist', stocks: [{symbol: 'AAPL', market_value: 4}, {symbol: 'MSFT', market_value: -1}]};

    let result = component.totalMarketValueCalculator(watchlistStub);

    expect(result).toEqual(3);
  });

  it('should calculate total day change of stocks that a watchlist has', () => {
    let watchlistStub = {watchlist_name: 'Just a test watchlist', stocks: [{symbol: 'AAPL', day_change: 2}, {symbol: 'MSFT', day_change: 5}]};

    let result = component.totalDayChangeCalculator(watchlistStub);

    expect(result).toEqual('7.00');

  })

});
