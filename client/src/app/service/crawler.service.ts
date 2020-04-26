import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {

  constructor(
    private api: ApiService
  ) { }

  search(keyword: string) {
    return this.api.get('movie/' + keyword);
  }

}
