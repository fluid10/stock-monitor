import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioComponent } from './portfolio.component';

import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import { HttpModule }    from '@angular/http';

import { MoneyAbbreviatePipe } from '../money-abbreviate.pipe';

import { ChartsModule } from 'ng2-charts';

import { WatchlistService } from '../watchlist.service';

import { DbService } from '../db.service';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioComponent, MoneyAbbreviatePipe ],
      imports: [
        RouterModule.forRoot([]),
        HttpModule,
        ChartsModule
      ],
      providers: [ {provide: APP_BASE_HREF, useValue: '/'}, WatchlistService, DbService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
