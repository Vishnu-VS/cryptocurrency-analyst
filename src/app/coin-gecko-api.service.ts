import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MarketChartParameters } from './market-chart-parameters';

@Injectable({
  providedIn: 'root',
})
export class CoinGeckoApiService {
  baseUrl: string = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  marketChart(marketChartParams: MarketChartParameters) {
    return this.http.get(
      this.baseUrl + '/coins/'+
        marketChartParams.id +
        '/market_chart?vs_currency=' +
        marketChartParams.vs_currency +
        '&days=' +
        marketChartParams.days +
        '&interval=daily'
    );
  }
}
