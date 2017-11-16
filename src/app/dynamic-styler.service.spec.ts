import { TestBed, inject } from '@angular/core/testing';

import { DynamicStylerService } from './dynamic-styler.service';

describe('DynamicStylerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicStylerService]
    });
  });

  it('should be created', inject([DynamicStylerService], (service: DynamicStylerService) => {
    expect(service).toBeTruthy();
  }));
});
