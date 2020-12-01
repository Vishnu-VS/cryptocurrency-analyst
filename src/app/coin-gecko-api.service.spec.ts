import { TestBed } from '@angular/core/testing';

import { CoinGeckoApiService } from './coin-gecko-api.service';

describe('CoinGeckoApiService', () => {
  let service: CoinGeckoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinGeckoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
