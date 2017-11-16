import { TestBed, inject } from '@angular/core/testing';

import {HttpModule} from '@angular/http';

import { StockService } from './stock.service';

import { DbService } from './db.service';

describe('StockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    	imports: [ HttpModule ],
      providers: [StockService, DbService]
    });
  });

  it('should be created', inject([StockService], (service: StockService) => {
    expect(service).toBeTruthy();
  }));
});
