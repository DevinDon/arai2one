import { Component, OnInit } from '@angular/core';
import { Detail } from '@iinfinity/movie-crawler';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  keyword = '';
  movies: Detail[] = [];

  constructor() { }

  ngOnInit() { }

  search(value: any) {
    if (value) {
      this.keyword = value;
      this.movies = undefined;
    }
  }

}
