import { Injectable } from '@angular/core';
import { Aria2, Option } from '@iinfinity/aria2';
import { timer } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, share, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Aria2Service {

  public client: Aria2;

  constructor() { }

  async connect(option: Option = {
    host: '192.168.0.241',
    port: 6800,
    path: '/jsonrpc',
    secure: false,
    secret: 'SECRET'
  }) {
    this.client = new Aria2(option);
    return this.client.connect();
  }

  syncActive() {
    return timer(0, 1500)
      .pipe(
        switchMap(_ => fromPromise(this.client.tellActive())),
        map(tasks => tasks.filter(task => task.files[0]?.path)),
        share()
      );
  }

  syncWaiting(offset = 0, total = 100) {
    return timer(0, 1500)
      .pipe(
        switchMap(_ => fromPromise(this.client.tellWaiting(offset, total))),
        map(tasks => tasks.filter(task => task.files[0]?.path)),
        share()
      );
  }

  syncStopped(offset = 0, total = 100) {
    return timer(0, 1500)
      .pipe(
        switchMap(_ => fromPromise(this.client.tellStopped(offset, total))),
        map(tasks => tasks.filter(task => task.files[0]?.path)),
        share()
      );
  }

}
