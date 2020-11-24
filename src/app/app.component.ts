import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'cryptocurrency-analyst';

  coinsTrending: any;
  marketchart:any;
  chartOption: EChartOption;
  prices: any[] = [];
  maxPrice: any;
  minPrice: any;
  priceInterval: any[] = [];
  chartOptionGrouped: any[] = [];

  constructor(private http: HttpClient, private changeDetectorRef:ChangeDetectorRef) { }

  async getMarketChart(id:string, num:number){
    const marketcharttemp = await this.http.get("https://api.coingecko.com/api/v3/coins/"+id+"/market_chart?vs_currency=usd&days=30&interval=daily").toPromise();
    // console.log(num);
    // console.log(marketcharttemp);
    return marketcharttemp;
  }

  ngOnInit(){
    // this.http.get('https://api.coingecko.com/api/v3/ping').subscribe((res)=>{
    //   //console.log(res);
    // });
    // this.http.get('https://api.coingecko.com/api/v3/coins/list').subscribe((res)=>{
    //   // console.log(res);
    // });
    this.http.get('https://api.coingecko.com/api/v3/search/trending').subscribe((res)=>{
      this.coinsTrending = res;
      // console.log(this.coinsTrending.coins);
      for(let i=0;i<this.coinsTrending.coins.length; i++){
        // console.log(this.coinsTrending.coins[i].item.id);
        // this.marketchart = this.getMarketCap(this.coinsTrending.coins[i].item.id, i);
        // this.getMarketChart(this.coinsTrending.coins[i].item.id, i).then(response => {
          this.http.get("https://api.coingecko.com/api/v3/coins/"+this.coinsTrending.coins[i].item.id+"/market_chart?vs_currency=usd&days=30&interval=daily").subscribe(response => {
          // console.log(response);
          let marketchart:any = response;
          let maxPrice: any;
          let minPrice: any;
          // console.log(this.marketchart.value);
        //this.marketchart = res;
      for(let j=0; j<marketchart.prices.length; j++){
        if(j==0){
          maxPrice=marketchart.prices[j][1];
          minPrice=marketchart.prices[j][1];
        }
        else{
          if(maxPrice < marketchart.prices[j][1]){
            maxPrice=marketchart.prices[j][1];
          }
          if(minPrice > marketchart.prices[j][1]){
            minPrice=marketchart.prices[j][1];
          }
        }
        // console.log(marketchart.prices[j][1]);
        this.prices.push(marketchart.prices[j][1]);
      }
      // console.log(this.prices);
      // console.log("Max Price:"+maxPrice);
      // console.log("Min Price:"+minPrice);
       this.chartOption = {
        title: {
          text: this.coinsTrending.coins[i].item.id,
          show: true
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          show: false
        },
        yAxis: {
          show: false,
          type: 'value',
          min: minPrice,
          max: maxPrice,
          splitLine: {
            show: false
          }

        },
        series: [
          {
            data: this.prices,
            type: 'line',
            animationEasing: "linear",
            animationDuration: 1000,
            showSymbol: false,
            hoverAnimation: false,
          },
        ],
      }
        this.chartOptionGrouped.push(this.chartOption);
        this.prices = [];
        });
      }
      // console.log(this.coinsTrending.coins.length);
      console.log(this.chartOptionGrouped);
      for(let i=0; i<this.coinsTrending.coins.length; i++){
        console.log(i);
        let searchterm = this.coinsTrending.coins[i].item.id;
        console.log(searchterm);
        for(let j=0; j<this.coinsTrending.coins.length; j++){
          let tempstorage;
          console.log(this.chartOptionGrouped[j]);
          console.log(searchterm);
          if(this.chartOptionGrouped[j].title.text == searchterm){
            console.log("match");
            console.log("i="+i+"j="+j);
            if(i!=j){
              tempstorage = this.chartOptionGrouped[i];
              this.chartOptionGrouped[i] = this.chartOptionGrouped[j];
              this.chartOptionGrouped[j] = tempstorage;
            }
          }
        }
      }
      console.log(this.chartOptionGrouped);
    });
  //   this.http.get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily").subscribe((res)=>{
  //     // console.log(res);
  //     this.marketchart = res;
  //     for(let i=0; i<this.marketchart.prices.length; i++){
  //       if(i==0){
  //         this.maxPrice=this.marketchart.prices[i][1];
  //         this.minPrice=this.marketchart.prices[i][1];
  //       }
  //       else{
  //         if(this.maxPrice < this.marketchart.prices[i][1]){
  //           this.maxPrice=this.marketchart.prices[i][1];
  //         }
  //         if(this.minPrice > this.marketchart.prices[i][1]){
  //           this.minPrice=this.marketchart.prices[i][1];
  //         }
  //       }
  //       // console.log(this.marketchart.prices[i][1]);
  //       this.prices.push(this.marketchart.prices[i][1]);
  //     }
  //     console.log(this.prices);
  //     console.log("Max Price:"+this.maxPrice);
  //     console.log("Min Price:"+this.minPrice);
  //     this.chartOption = {
  //       xAxis: {
  //         type: 'category',
  //         splitLine: {
  //           show: false
  //         },
  //         show: false
  //       },
  //       yAxis: {
  //         show: false,
  //         type: 'value',
  //         min: this.minPrice,
  //         max: this.maxPrice,
  //         splitLine: {
  //           show: false
  //         }

  //       },
  //       series: [
  //         {
  //           data: this.prices,
  //           type: 'line',
  //           animationEasing: "linear",
  //           animationDuration: 1000,
  //           showSymbol: false,
  //           hoverAnimation: false,
  //         },
  //       ],
  //     };
  //     this.changeDetectorRef.detectChanges();
  //   });

  }

}
