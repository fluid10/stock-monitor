import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { CompanySearchComponent } from './company-search.component';
import { CompanyService } from './company.service';

import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistService } from './watchlist.service';
import { Watchlist } from './watchlist';
import { WatchlistDetailComponent } from './watchlist-detail/watchlist-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { MoneyAbbreviatePipe } from './money-abbreviate.pipe';

import { DbService } from './db.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:      [ 
      BrowserModule,
      HttpModule,
      RouterTestingModule
      ],
      declarations: [
        AppComponent,
        CompanySearchComponent,
        WatchlistComponent,
        WatchlistDetailComponent,
        MoneyAbbreviatePipe
      ],
      providers: [ CompanyService, WatchlistService, Watchlist, DbService ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Hello Angular');
  }));
});
