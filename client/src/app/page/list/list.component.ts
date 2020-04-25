import { Component, OnInit } from '@angular/core';
import { Aria2, Task } from '@iinfinity/aria2';
import { Aria2Service } from 'src/app/service/aria2.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  test: number = 0;

  tasks: Task[];
  activeTasks: Task[];
  waitingTasks: Task[];
  stoppedTasks: Task[];

  status?: boolean;

  constructor(
    private aria2: Aria2Service
  ) { }

  async ngOnInit() {
    await this.aria2.connect()
      .then(v => {
        this.status = true;
        this.aria2.syncActive()
          .subscribe(tasks => this.activeTasks = tasks);
        this.aria2.syncStopped()
          .subscribe(tasks => this.stoppedTasks = tasks);
        this.aria2.syncWaiting()
          .subscribe(tasks => this.waitingTasks = tasks);
      })
      .catch(e => {
        console.error(e);
        this.status = false;
      });
  }

  // async getActiveTasks() {
  //   this.activeTasks = await this.client.tellActive();
  //   console.log(this.activeTasks);
  //   return this.activeTasks;
  // }

  // async getWaitingTasks(offset = 0, total = 10) {
  //   this.waitingTasks = await this.client.tellWaiting(offset, total);
  //   console.log(this.waitingTasks);
  //   return this.waitingTasks;
  // }

  // async getAllTasks(offset = 0, total = 10) {
  //   this.activeTasks = await this.client.tellActive();
  //   this.waitingTasks = await this.client.tellWaiting(offset, total);
  //   this.stoppendTasks = await this.client.tellStopped(offset, total);
  //   this.tasks = ([] as Task[]).concat(this.activeTasks)
  //     .concat(this.waitingTasks)
  //     .concat(this.stoppendTasks)
  //     .filter(task => task.files[0]?.path);
  //   console.log(this.tasks);
  //   return this.tasks;
  // }

}
