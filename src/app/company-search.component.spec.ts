import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CompanySearchComponent } from './company-search.component';

import { WatchlistComponent } from './watchlist/watchlist.component';

import { MoneyAbbreviatePipe } from './money-abbreviate.pipe';

import { Watchlist } from './watchlist';

import { CompanyService } from './company.service';
import { Company } from './company';

import { WatchlistDetailComponent } from './watchlist-detail/watchlist-detail.component';
import { StockService } from './stock.service';
import { DbService } from './db.service';
import { WatchlistService } from './watchlist.service';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

describe('CompanySearchComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:      [ 
      BrowserModule,
      HttpModule,
      RouterModule.forRoot([])
      ],
      declarations: [
        CompanySearchComponent, WatchlistDetailComponent, WatchlistComponent, MoneyAbbreviatePipe
      ],
      providers: [ {provide: CompanyService}, StockService, DbService, WatchlistService, {provide: APP_BASE_HREF, useValue: '/'}, Watchlist ]
    }).compileComponents();
  }));
  it('should select a company', async(() => {
    const companyName = 'AAPL';

    const fixture = TestBed.createComponent(CompanySearchComponent);
    const app = fixture.debugElement.componentInstance;
    
    app.selectCompany(companyName);
    var compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#selected-company').textContent).toEqual(companyName)
  }));
});
