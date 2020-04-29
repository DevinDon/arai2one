import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(
    private api: ApiService
  ) { }

  search(keyword: string) {
    return this.api.get('search/' + keyword);
  }

  getDetail(id: string) {
    return this.api.get('movie/' + id);
  }

  getDetails(ids: string[]) {
    return this.api.post('movie', { ids });
  }

}
