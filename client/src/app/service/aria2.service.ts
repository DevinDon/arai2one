import { Injectable } from '@angular/core';
import { Aria2 } from '@iinfinity/aria2';

@Injectable({
  providedIn: 'root'
})
export class Aria2Service {

  public readonly client: Aria2;

  constructor() {
    this.client = new Aria2({
      host: '192.168.0.241',
      port: 6800,
      path: '/jsonrpc',
      secure: false,
      secret: 'SECRET'
    });
  }

  connect() {
    return this.client.connect();
  }

}
