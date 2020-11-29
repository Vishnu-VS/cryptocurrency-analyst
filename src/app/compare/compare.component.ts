import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormGroup, FormControl} from '@angular/forms';

export interface Coins{
  id: string,
  name: string,
  symbol: string
}

export interface MarketChartParameters{
  id: string,
  vs_currency: string,
  days: string
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
  selectedCoin = new FormControl('bitcoin');
  selectedCurrency= new FormControl('USD');
  selectedDays= new FormControl('30');
  options: Coins[];
  filteredOptions: Observable<Coins[]>;
  marketChartParams: MarketChartParameters[];
  chartOptionGrouped: any[] = [];
  marketchartPrices: any[] = [];
  fetchCoinData = new FormGroup({
    selectedCoin: new FormControl('')
  });

  constructor(private http: HttpClient) {}

  marketChartApi(marketChartParams: MarketChartParameters) {
    return this.http
      .get(
        'https://api.coingecko.com/api/v3/coins/' +
          marketChartParams.id +
          '/market_chart?vs_currency='+marketChartParams.vs_currency+'&days='+marketChartParams.days+'&interval=daily'
      )
      .toPromise();
  }

  async getMarketChart(marketChartParams: MarketChartParameters[]) {
    // console.log(coins);
    for (let i = 0; i < marketChartParams.length; i++) {
      var marketcharttemp = await this.marketChartApi(marketChartParams[i]);
      // console.log(i);
      // console.log(marketcharttemp);
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
        //this.prices.push(marketchart.prices[j][1]);
        this.marketchartPrices.push(marketchart.prices[j][1]);
      }
      // console.log(this.marketchartPrices);
      // console.log(maxPrice);
      // console.log(minPrice);
      this.chartOption = {
        // title: {
        //   text: this.coinsTrending.coins[i].item.id,
        //   show: true,
        // },
        xAxis: {
          type: 'category',
          splitLine: {
            show: true,
          },
          show: true,
        },
        yAxis: {
          show: true,
          type: 'value',
          // min: minPrice,
          // max: maxPrice,
          splitLine: {
            show: true,
          },
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            data: this.marketchartPrices,
            type: 'line',
            animationEasing: 'linear',
            animationDuration: 1000,
            showSymbol: true,
            hoverAnimation: true,
          },
        ],
      };
      this.chartOptionGrouped.push(this.chartOption);
      this.marketchartPrices = [];
    }
    console.log(this.chartOptionGrouped);
  }

  ngOnInit(): void {
    this.http
      .get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies').subscribe(res => {
        this.supportedCurrencies = res;
        for (var i = 0; i < this.supportedCurrencies.length; i++) {
          this.supportedCurrencies[i] = this.supportedCurrencies[i].toUpperCase();
        }
        // console.log(this.supportedCurrencies);
      }
    );
    this.http.get("https://api.coingecko.com/api/v3/coins/list").subscribe(res => {
      // console.log(res);
      this.options = <Coins[]>res;
    });
    this.filteredOptions = this.selectedCoin.valueChanges
      .pipe(
        startWith(''),
        map(value =>
          this._filter(value)
          )
      );
  }

  fetchCoinPrice(){
    console.log(this.selectedCoin.value);
    console.log(this.selectedCurrency.value);
    console.log(this.selectedDays.value);
    this.marketChartParams = [{
      id: this.selectedCoin.value,
      vs_currency: this.selectedCurrency.value,
      days: this.selectedDays.value
    }];
    // this.http
    //     .get(
    //       'https://api.coingecko.com/api/v3/coins/' +
    //       this.selectedCoin.value +
    //         '/market_chart?vs_currency='+this.selectedCurrency.value+'&days='+this.selectedDays.value+'&interval=daily'
    //     ).subscribe(res => {
    //       console.log(res);
    //     });
    this.getMarketChart(this.marketChartParams);
  }

  private _filter(value: string): Coins[] {
    if(value.length >2){
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    return null;
  }
}
