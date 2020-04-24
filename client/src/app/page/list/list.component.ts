import { Component, OnInit } from '@angular/core';
import { Aria2, Task } from '@iinfinity/aria2';
import { Aria2Service } from 'src/app/service/aria2.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  private client: Aria2;

  tasks: Task[];

  status?: boolean;

  constructor(
    private aria2: Aria2Service
  ) {
    console.log('Create list component.');
    this.client = aria2.client;
  }

  ngOnInit(): void {
    this.aria2.connect()
      .then(v => this.status = true)
      .catch(e => {
        console.error(e);
        this.status = false;
      });
    console.log('What');
  }

  async getActiveList() {
    this.tasks = await this.client.tellStopped(0, 10);
  }

}
