import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

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
  config: SwiperConfigInterface = {
    // a11y: true,
    direction: 'horizontal',
    slidesPerView: 4,
    slidesPerGroup: 2,
    // slideToClickedSlide: true,
    mousewheel: true,
    scrollbar: false,
    // watchSlidesProgress: true,
    navigation: true,
    keyboard: true,
    pagination: false,
    // centeredSlides: true,
    loop: true,
    loopFillGroupWithBlank: true,
    // roundLengths: true,
    // slidesOffsetBefore: 100,
    // slidesOffsetAfter: 100,
    // spaceBetween: 10,
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
        768:{
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        1024:{
          slidesPerView: 4,
          slidesPerGroup: 2,
        }
    }
};

  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  marketChartApi(id: string) {
    return this.http
      .get(
        'https://api.coingecko.com/api/v3/coins/' +
          id +
          '/market_chart?vs_currency=usd&days=30&interval=daily'
      )
      .toPromise();
  }

  async getMarketChart(coins) {
    // console.log(coins);
    for (let i = 0; i < coins.length; i++) {
      var marketcharttemp = await this.marketChartApi(coins[i].item.id);
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
    // console.log(this.chartOptionGrouped);
  }

  ngOnInit(): void {
    this.http
      .get('https://api.coingecko.com/api/v3/search/trending')
      .subscribe((res) => {
        this.coinsTrending = res;
        // console.log(this.coinsTrending.coins);
        this.changeDetectorRef.detectChanges();
        this.getMarketChart(this.coinsTrending.coins);
      });
  }
}
