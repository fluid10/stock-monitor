import { TestBed, async, getTestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CompanyService } from './company.service';
import { Company } from './company';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Headers, Http }    from '@angular/http';

describe('CompanyService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [CompanyService]
    })
  })

  it('should return Company[] of matched objects we searched for', async(inject([CompanyService], (service: CompanyService) => {
    return service.search('Microsoft')
    .toPromise()
    .then((result) => {
      
      let expected: Object[] = [
      {"symbol":"MSFT",
       "name":"Microsoft Corporation",
       "sector":"Technology","industry":"Computer Software: Prepackaged Software"
      }];

      expect(expected).toEqual(result);
    });
  })));

});
