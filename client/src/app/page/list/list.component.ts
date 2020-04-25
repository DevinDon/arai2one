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
  activeTasks: Task[];
  waitingTasks: Task[];
  stoppendTasks: Task[];

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
  }

  async getActiveTasks() {
    this.activeTasks = await this.client.tellActive();
    console.log(this.activeTasks);
    return this.activeTasks;
  }

  async getWaitingTasks(offset = 0, total = 10) {
    this.waitingTasks = await this.client.tellWaiting(offset, total);
    console.log(this.waitingTasks);
    return this.waitingTasks;
  }

  async getAllTasks(offset = 0, total = 10) {
    this.activeTasks = await this.client.tellActive();
    this.waitingTasks = await this.client.tellWaiting(offset, total);
    this.stoppendTasks = await this.client.tellStopped(offset, total);
    this.tasks = ([] as Task[]).concat(this.activeTasks)
      .concat(this.waitingTasks)
      .concat(this.stoppendTasks)
      .filter(task => task.files[0]?.path);
    console.log(this.tasks);
    return this.tasks;
  }

}
