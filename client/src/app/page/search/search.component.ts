import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { AppService } from 'src/app/service/app.service';
import { Aria2Service } from 'src/app/service/aria2.service';
import { Summary } from 'src/app/service/model';
import { MovieService } from 'src/app/service/movie.service';
import { Device } from 'src/app/util/device';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChild('input') input: ElementRef<HTMLElement>;

  device: Device;
  keyword = '';
  list: Summary[] = [];

  constructor(
    private app: AppService,
    private aria2: Aria2Service,
    private movie: MovieService
  ) { }

  ngOnInit() {
    this.app.observableDevice()
      .subscribe(device => this.device = device);
  }

  search(keyword: string) {
    if (!keyword) { return; }
    this.keyword = keyword;
    this.list = undefined;
    this.movie.search(keyword)
      .pipe(
        timeout(10 * 1000),
        catchError(e => (this.app.openBar('服务器在开小差，再试试看', '好吧'), of([])))
      ).subscribe(v => this.list = v);
    setTimeout(() => this.input.nativeElement.blur(), 100);
  }

  trackByMovieID(index: number, movie: { id: string }): string {
    return movie.id;
  }

}
