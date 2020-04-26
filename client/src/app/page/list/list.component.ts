import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '@iinfinity/aria2';
import { Subscription } from 'rxjs';
import { Aria2Service } from 'src/app/service/aria2.service';
import { destory } from 'src/app/util/subscription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  tasks: Task[];
  activeTasks: Task[];
  stoppedTasks: Task[];
  waitingTasks: Task[];

  state?: boolean;

  constructor(
    private aria2: Aria2Service
  ) { }

  ngOnInit() {
    this.aria2.observableClient()
      .subscribe(state => {
        console.log(state);
        destory(this.subscriptions)
        if (state) {
          this.subscriptions.push(
            this.aria2.syncActive()
              .subscribe(tasks => this.activeTasks = tasks),
            this.aria2.syncStopped()
              .subscribe(tasks => this.stoppedTasks = tasks),
            this.aria2.syncWaiting()
              .subscribe(tasks => this.waitingTasks = tasks)
          );
        }
      });
  }

  sync(type: 1 | 2 | 3 | 'active' | 'stopped' | 'waiting') {
    destory(this.subscriptions);
    switch (type) {
      case 1:
      case 'active': {
        this.subscriptions.push(
          this.aria2.syncActive()
            .subscribe(tasks => this.activeTasks = tasks)
        );
        break;
      }
      case 2:
      case 'stopped': {
        this.subscriptions.push(
          this.aria2.syncStopped()
            .subscribe(tasks => this.stoppedTasks = tasks)
        );
        break;
      }
      case 3:
      case 'waiting': {
        this.subscriptions.push(
          this.aria2.syncWaiting()
            .subscribe(tasks => this.waitingTasks = tasks)
        );
        break;
      }
    }
  }

  trackByGID(index: number, task: Task): string {
    return task.gid;
  }

  ngOnDestroy(): void {
    destory(this.subscriptions);
  }

}
