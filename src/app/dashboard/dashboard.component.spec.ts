import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

import { WatchlistComponent } from '../watchlist/watchlist.component';

import { PortfolioComponent } from '../portfolio/portfolio.component';

import { MoneyAbbreviatePipe } from '../money-abbreviate.pipe';

import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { ChartsModule } from 'ng2-charts';

import { Watchlist } from '../watchlist';

import { WatchlistService } from '../watchlist.service';

import { DbService } from '../db.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent, WatchlistComponent, PortfolioComponent, MoneyAbbreviatePipe ],
      imports: [
        RouterModule.forRoot([]),
        ChartsModule
      ],
      providers: [ {provide: APP_BASE_HREF, useValue: '/'}, Watchlist, WatchlistService, DbService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
