import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MarketChartParameters } from '../market-chart-parameters';
import { CoinGeckoApiService } from '../coin-gecko-api.service';

export interface Coins {
  id: string;
  name: string;
  symbol: string;
}

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  chartOption: EChartOption;
  supportedCurrencies: any;
  currencyDropdown: any;
  selectedCoin = new FormControl('bitcoin-cash');
  selectedCurrency = new FormControl('USD');
  selectedDays = new FormControl('30');
  options: Coins[];
  filteredOptions: Observable<Coins[]>;
  marketChartParams: MarketChartParameters[];
  chartOptionGrouped: any[] = [];
  marketchartPrices: any[] = [];
  marketchartDate: any[] = [];
  chartSeriesData: any[] = [];
  heading: string;
  fetchCoinData = new FormGroup({
    selectedCoin: new FormControl(''),
  });

  constructor(private http: HttpClient, private cgApi: CoinGeckoApiService) {}

  marketChartApi(marketChartParams: MarketChartParameters) {
    return this.cgApi.marketChart(marketChartParams)
      .toPromise();
  }

  async getMarketChart(marketChartParams: MarketChartParameters[]) {
    for (let i = 0; i < marketChartParams.length; i++) {
      var marketcharttemp = await this.marketChartApi(marketChartParams[i]);
      let marketchart: any = marketcharttemp;
      let maxPrice: any;
      let minPrice: any;
      var date: Date, formattedDate: string;
      var pipe = new DatePipe('en-US');

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
        date = new Date(marketchart.prices[j][0]);
        formattedDate = pipe.transform(date, 'shortDate');
        this.marketchartDate.push(formattedDate);
      }
      this.chartSeriesData.push({
        data: this.marketchartPrices,
        type: 'line',
        animationEasing: 'linear',
        animationDuration: 1000,
        showSymbol: true,
        hoverAnimation: true,
      });
      if (i == marketChartParams.length - 1) {
        this.chartOption = {
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100,
            },
            {
              start: 0,
              end: 100,
              handleIcon:
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            },
          ],
          xAxis: {
            type: 'category',
            splitLine: {
              show: true,
            },
            show: true,
            data: this.marketchartDate,
          },
          yAxis: {
            show: true,
            type: 'value',
            splitLine: {
              show: true,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          series: this.chartSeriesData,
        };
      }
      this.marketchartPrices = [];
      this.marketchartDate = [];
    }
    console.log(this.chartOption);
    this.heading = 'Cryptocurrency Prices- Add another to compare';
  }

  fetchCoinPrice() {
    console.log(this.selectedCoin.value);
    console.log(this.selectedCurrency.value);
    console.log(this.selectedDays.value);
    this.marketChartParams = [
      {
        id: this.selectedCoin.value,
        vs_currency: this.selectedCurrency.value,
        days: this.selectedDays.value,
      },
    ];
    this.getMarketChart(this.marketChartParams);
  }

  private _filter(value: string): Coins[] {
    if (value.length > 2) {
      const filterValue = value.toLowerCase();
      return this.options.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
    return null;
  }

  ngOnInit(): void {
    this.heading =
      'Cryptocurrency Prices - Select cryptocurrency to view prices';
    this.http
      .get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
      .subscribe((res) => {
        this.supportedCurrencies = res;
        for (var i = 0; i < this.supportedCurrencies.length; i++) {
          this.supportedCurrencies[i] = this.supportedCurrencies[
            i
          ].toUpperCase();
        }
      });
    this.http
      .get('https://api.coingecko.com/api/v3/coins/list')
      .subscribe((res) => {
        this.options = <Coins[]>res;
      });
    this.filteredOptions = this.selectedCoin.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
}
