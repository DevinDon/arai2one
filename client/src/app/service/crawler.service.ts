import { Injectable } from '@angular/core';
import { Crawler } from '@iinfinity/movie-crawler';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {

  private crawler: Crawler;

  constructor() {
    this.crawler = new Crawler();
  }

  search(keyword: string) {
    return fromPromise(this.crawler.search(keyword));
  }

}
