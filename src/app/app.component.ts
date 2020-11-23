import { ChangeDetectorRef, Component, OnInit,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'cryptocurrency-analyst';

  coinsTrending: any;
  constructor(private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(){
    this.http.get('https://api.coingecko.com/api/v3/ping').subscribe((res)=>{
      console.log(res);
    });
    this.http.get('https://api.coingecko.com/api/v3/coins/list').subscribe((res)=>{
      // console.log(res);
    });
    this.http.get('https://api.coingecko.com/api/v3/search/trending').subscribe((res)=>{
      this.coinsTrending = res;
      // for(let i=0;i<this.coinsTrending.coins.length; i++){
      //   console.table(this.coinsTrending.coins[i]);
      // }
      console.log(this.coinsTrending.coins);
      this.changeDetectorRef.detectChanges();
    });
  }

}
