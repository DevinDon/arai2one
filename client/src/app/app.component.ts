// src/app/app.component.ts

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddTaskDialogComponent } from './component/add-task-dialog/add-task-dialog.component';
import { Navigation } from './module/routing/routes';
import { AppService } from './service/app.service';
import { Aria2Service } from './service/aria2.service';
import { destory } from './util/subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];
  private activeTasksSubscription: Subscription;

  title = 'Aria2One';
  navigation: Navigation = { icon: 'ri-home-3-line', link: ['/'], tip: 'Home' };
  state?: boolean;
  downloadSpeed = 0;
  uploadSpeed = 0;

  constructor(
    public app: AppService,
    private aria2: Aria2Service
  ) {
    this.subscriptions.push(
      app.observableRouterData()
        .subscribe(data => {
          this.title = data.title;
          this.navigation = data.navigation || { icon: 'ri-home-3-line', link: ['/'], tip: 'Home' };
        })
    );
    this.connect();
  }

  connect() {
    this.subscriptions.push(
      this.aria2.connect()
        .subscribe(state => this.state = state)
    );
  }

  addTaskDialog() {
    this.app.openDialog(AddTaskDialogComponent);
  }

  ngOnDestroy(): void {
    destory(this.subscriptions);
  }

}
