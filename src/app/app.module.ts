import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';

import { AppComponent }  from './app.component';
import { CompanySearchComponent } from './company-search.component';
import { CompanyService } from './company.service';

import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistService } from './watchlist.service';
import { Watchlist } from './watchlist';
import { WatchlistDetailComponent } from './watchlist-detail/watchlist-detail.component';

import { DynamicStylerService } from './dynamic-styler.service';

import { DashboardComponent } from './dashboard/dashboard.component';

import { StockService } from './stock.service';

import { DbService } from './db.service';
import { MoneyAbbreviatePipe } from './money-abbreviate.pipe';
import { PortfolioComponent } from './portfolio/portfolio.component';

@NgModule({
  imports:      [ 
  BrowserModule,
  HttpModule,
  ChartsModule,
  RouterModule.forRoot([
      {
        path: 'watchlist/:id',
        component: CompanySearchComponent
      },
      { path: 'dashboard',
        component: DashboardComponent },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [
  	AppComponent,
  	CompanySearchComponent,
  	WatchlistComponent,
  	WatchlistDetailComponent,
  	MoneyAbbreviatePipe,
    DashboardComponent,
    PortfolioComponent ],
  providers: [ CompanyService, WatchlistService, Watchlist, StockService, DbService, DynamicStylerService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
