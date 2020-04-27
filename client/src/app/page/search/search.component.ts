import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';
import { AppService } from 'src/app/service/app.service';
import { CrawlerService } from 'src/app/service/crawler.service';
import { Device } from 'src/app/util/device';

interface Movie {
  title: string;
  url: string;
  image?: string;
  desc?: string;
  type?: string;
  download?: {
    title: string;
    url: string;
    size: string;
  };
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  device: Device;
  keyword = '';
  movies: Movie[] = [];

  constructor(
    private app: AppService,
    private crawler: CrawlerService
  ) { }

  ngOnInit() {
    this.app.observableDevice()
      .subscribe(device => this.device = device);
  }

  search(keyword: string) {
    if (!keyword) { return; }
    this.keyword = keyword;
    this.movies = undefined;
    this.crawler.search(keyword)
      .pipe(
        timeout(5000),
        catchError(e => {
          this.app.openBar('请求超时，请重试。');
          this.movies = [];
          return of([]);
        }),
        tap(x => this.movies = x),
        switchMap(e => this.crawler.searchDetail(keyword).pipe(timeout(30000)))
      )
      .subscribe(movies => this.movies = movies);
  }

  private searchDetail(keyword: string) {
    if (!keyword) { return; }
    this.crawler.searchDetail(keyword)
      .pipe(
        timeout(30000),
        catchError(e => {
          this.app.openBar('请求超时，请重试。');
          return of([]);
        })
      )
      .subscribe(movies => this.movies = movies);
  }

  trackByMovieTitle(index: number, movie: Movie): string {
    return movie.title;
  }

}
