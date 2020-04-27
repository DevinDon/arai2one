import { Injectable } from '@angular/core';
import { Aria2, Option } from '@iinfinity/aria2';
import { BehaviorSubject, timer } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { distinctUntilChanged, map, share, switchMap, throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Aria2Service {

  private client: Aria2;
  private subjections = {
    connected: new BehaviorSubject<boolean | undefined>(undefined)
  };

  constructor() {
    this.client = new Aria2();
  }

  connect(option: Option = {
    host: '192.168.0.241',
    port: 6800,
    path: '/jsonrpc',
    secure: false,
    secret: 'SECRET'
  }) {
    this.client.on('open', e => this.subjections.connected.next(true));
    this.client.on('close', e => this.subjections.connected.next(undefined));
    this.client.on('error', e => this.subjections.connected.next(false));
    this.client.on('message', e => this.subjections.connected.next(true));
    this.client.connect(option);
    return this.observableClient();
  }

  observableClient() {
    return this.subjections.connected
      .pipe(
        throttleTime(50),
        distinctUntilChanged()
      );;
  }

  syncActive() {
    return timer(0, 1500)
      .pipe(
        switchMap(_ => fromPromise(this.client.tellActive())),
        // map(tasks => tasks.filter(task => task.files[0]?.path)),
        share()
      );
  }

  syncWaiting(offset = 0, total = 100) {
    return timer(0, 1500)
      .pipe(
        switchMap(_ => fromPromise(this.client.tellWaiting(offset, total))),
        // map(tasks => tasks.filter(task => task.files[0]?.path)),
        share()
      );
  }

  syncStopped(offset = 0, total = 100) {
    return timer(0, 1500)
      .pipe(
        switchMap(_ => fromPromise(this.client.tellStopped(offset, total))),
        // map(tasks => tasks.filter(task => task.files[0]?.path)),
        share()
      );
  }

  addTask(uri: string) {
    return fromPromise(this.client.addUri([uri]));
  }

  addTasks(uris: string[]) {
    return fromPromise(this.client.addUri(uris));
  }

}
