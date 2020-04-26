import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { AppService } from 'src/app/service/app.service';
import { CrawlerService } from 'src/app/service/crawler.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  keyword = '';
  movies: { title: string; url: string; }[] = [];

  constructor(
    private app: AppService,
    private crawler: CrawlerService
  ) { }

  ngOnInit() { }

  search(value: any) {
    if (value) {
      this.keyword = value;
      this.movies = undefined;
      this.crawler.search(value)
        .pipe(
          timeout(5000),
          catchError(e => {
            this.app.openBar('请求超时，请重试。');
            return of([]);
          })
        )
        .subscribe(movies => this.movies = movies);
    }
  }

}
