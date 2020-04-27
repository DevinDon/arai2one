import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '@iinfinity/aria2';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Aria2Service } from 'src/app/service/aria2.service';
import { destory } from 'src/app/util/subscription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private activeObservable: Subscription;
  private stoppedObservable: Subscription;
  private waitingObservable: Subscription;

  tasks: Task[];
  activeTasks: Task[];
  stoppedTasks: Task[];
  waitingTasks: Task[];
  state?: boolean;

  downloadSpeed = 0;
  uploadSpeed = 0;

  constructor(
    private aria2: Aria2Service
  ) { }

  ngOnInit() {
    this.aria2.observableClient()
      .subscribe(state => {
        destory(
          [this.activeObservable, this.stoppedObservable, this.waitingObservable].filter(v => v)
        );
        // tslint:disable-next-line: no-conditional-assignment
        if (this.state = state) {
          this.subscriptions.push(
            this.activeObservable = this.aria2.syncActive()
              .subscribe(tasks => {
                this.activeTasks = tasks;
                this.downloadSpeed = this.uploadSpeed = 0;
                for (const task of tasks) {
                  this.downloadSpeed += +task.downloadSpeed;
                  this.uploadSpeed += +task.uploadSpeed;
                }
              })
          );
          this.stoppedObservable = this.aria2.syncStopped()
            .pipe(first())
            .subscribe(tasks => this.stoppedTasks = tasks);
          this.waitingObservable = this.aria2.syncWaiting()
            .pipe(first())
            .subscribe(tasks => this.waitingTasks = tasks);
        }
      });
  }

  sync(type: 1 | 2 | 3 | 'active' | 'stopped' | 'waiting') {
    destory([this.stoppedObservable, this.waitingObservable]);
    switch (type) {
      case 2:
      case 'stopped':
        this.subscriptions.push(
          this.stoppedObservable = this.aria2.syncStopped()
            .subscribe(tasks => this.stoppedTasks = tasks)
        );
        break;
      case 3:
      case 'waiting':
        this.subscriptions.push(
          this.waitingObservable = this.aria2.syncWaiting()
            .subscribe(tasks => this.waitingTasks = tasks)
        );
        break;
    }
  }

  trackByGID(index: number, task: Task): string {
    return task.gid;
  }

  getTaskName(task: Task) {
    if (task.files[0].path) {
      return task.files[0].path.slice(task.dir.length + 1);
    }
    const uri = task.files[0].uris[0].uri;
    const split = uri.split('/');
    return decodeURIComponent(split[split.length - 1]);
  }

  ngOnDestroy(): void {
    destory(this.subscriptions);
  }

}
