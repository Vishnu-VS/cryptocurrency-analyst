import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';
import { MarketChartParameters } from '../market-chart-parameters';
import { CoinGeckoApiService } from '../coin-gecko-api.service';
import { graphic } from 'echarts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  coinsTrending: any;
  chartOption: EChartOption;
  prices: any[] = [];
  maxPrice: any;
  minPrice: any;
  chartOptionGrouped: any[] = [];
  marketchartPrices: any[] = [];
  marketChartParams: MarketChartParameters;

  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private cgApi: CoinGeckoApiService
  ) {}

  marketChartApi(id: string) {
    this.marketChartParams={
      id: id,
      vs_currency: 'usd',
      days: '30'
    };
    return this.cgApi.marketChart(this.marketChartParams)
      .toPromise();
  }

  async getMarketChart(coins) {
    for (let i = 0; i < coins.length; i++) {
      var marketcharttemp = await this.marketChartApi(coins[i].item.id);
      let marketchart: any = marketcharttemp;
      let maxPrice: any;
      let minPrice: any;

      for (let j = 0; j < marketchart.prices.length; j++) {
        if (j == 0) {
          maxPrice = marketchart.prices[j][1];
          minPrice = marketchart.prices[j][1];
        } else {
          if (maxPrice < marketchart.prices[j][1]) {
            maxPrice = marketchart.prices[j][1];
          }
          if (minPrice > marketchart.prices[j][1]) {
            minPrice = marketchart.prices[j][1];
          }
        }
        this.marketchartPrices.push(marketchart.prices[j][1]);
      }
      this.chartOption = {
        xAxis: {
          type: 'category',
          splitLine: {
            show: false,
          },
          show: false,
        },
        yAxis: {
          show: false,
          type: 'value',
          min: minPrice,
          max: maxPrice,
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            data: this.marketchartPrices,
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#673ab7'
          },
          areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#b397e6'
              }, {
                  offset: 1,
                  color: '#673ab7'
              }])
          },
            animationEasing: 'linear',
            animationDuration: 1000,
            showSymbol: false,
            hoverAnimation: false,
          },
        ],
      };
      this.chartOptionGrouped.push(this.chartOption);
      this.marketchartPrices = [];
    }
  }

  ngOnInit(): void {
    this.http
      .get('https://api.coingecko.com/api/v3/search/trending')
      .subscribe((res) => {
        this.coinsTrending = res;
        this.changeDetectorRef.detectChanges();
        this.getMarketChart(this.coinsTrending.coins);
      });
  }
}
