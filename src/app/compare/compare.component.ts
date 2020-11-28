import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {

  chartOption: EChartOption;
  supportedCurrencies: any;
  currencyDropdown: any;

  constructor(private http: HttpClient) {}

  supported_currencies_api() {
    return this.http
      .get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
      .toPromise();
  }

  async get_supported_currencies() {
    this.supportedCurrencies = await this.supported_currencies_api();
    for (var i = 0; i < this.supportedCurrencies.length; i++) {
      this.supportedCurrencies[i] = this.supportedCurrencies[i].toUpperCase();
    }
    console.log(this.supportedCurrencies);
  }

  ngOnInit(): void {
    this.get_supported_currencies();
  }
}
