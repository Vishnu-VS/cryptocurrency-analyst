import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

export interface Coins{
  id: string,
  name: string,
  symbol: string
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
  myControl = new FormControl();
  options: Coins[];
  filteredOptions: Observable<Coins[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies').subscribe(res => {
        this.supportedCurrencies = res;
        for (var i = 0; i < this.supportedCurrencies.length; i++) {
          this.supportedCurrencies[i] = this.supportedCurrencies[i].toUpperCase();
        }
        console.log(this.supportedCurrencies);
      }
    );
    this.http.get("https://api.coingecko.com/api/v3/coins/list").subscribe(res => {
      console.log(res);
      this.options = <Coins[]>res;
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value =>
          this._filter(value)
          )
      );
  }
  private _filter(value: string): Coins[] {
    if(value.length >2){
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    return null;
  }
}
