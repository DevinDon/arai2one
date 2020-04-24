import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  // private client: Aria2;

  items: string[];

  status?: boolean;

  constructor() {
    console.log('Create list component.');
    this.client = new Aria2({
      host: '192.168.0.241',
      port: 6800,
      secure: false,
      secret: 'SECRET',
      path: '/jsonrpc'
    });
  }

  ngOnInit(): void {
    this.client.open()
      .then(v => this.status = true)
      .catch(e => this.status = false);
  }

  getActiveList() {
    this.client.call('tellActive')
      .then(v => {
        this.items = v;
        console.log(this.items);
      });
  }

}
