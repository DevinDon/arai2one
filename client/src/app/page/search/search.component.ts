import { Component, OnInit } from '@angular/core';
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
    private crawler: CrawlerService
  ) { }

  ngOnInit() { }

  search(value: any) {
    if (value) {
      this.keyword = value;
      this.movies = undefined;
      this.crawler.search(value)
        .subscribe(movies => this.movies = movies);
    }
  }

}
