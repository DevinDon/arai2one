import { Component, OnInit, OnDestroy } from '@angular/core';
import { Aria2, Task } from '@iinfinity/aria2';
import { Aria2Service } from 'src/app/service/aria2.service';
import { Subscription } from 'rxjs';
import { destory } from 'src/app/util/subscription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  tasks: Task[];

  status?: boolean;

  constructor(
    private aria2: Aria2Service
  ) { }

  ngOnInit() {
    this.aria2.connect()
      .then(v => this.status = true)
      .catch(e => {
        console.error(e);
        this.status = false;
      });
  }

  trackByGID(index: number, task: Task): string {
    return task.gid;
  }

  sync(type: 'active' | 'stopped' | 'waiting') {
    destory(this.subscriptions);
    switch (type) {
      case 'active': {
        this.subscriptions.push(
          this.aria2.syncActive()
            .subscribe(tasks => this.tasks = tasks)
        );
        break;
      }
      case 'stopped': {
        this.subscriptions.push(
          this.aria2.syncStopped()
            .subscribe(tasks => this.tasks = tasks)
        );
        break;
      }
      case 'waiting': {
        this.subscriptions.push(
          this.aria2.syncWaiting()
            .subscribe(tasks => this.tasks = tasks)
        );
        break;
      }
    }
  }

  ngOnDestroy(): void {
    destory(this.subscriptions);
  }

}
