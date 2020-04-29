import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { AppService } from 'src/app/service/app.service';
import { Aria2Service } from 'src/app/service/aria2.service';
import { Download } from 'src/app/service/model';

@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Download[],
    private app: AppService,
    private aria2: Aria2Service
  ) { }

  ngOnInit() { }

  download(uri: string) {
    this.aria2.addTask(uri)
      .pipe(
        catchError(e => {
          this.app.openBar('任务添加失败，请重试。', '确认');
          throw e;
        })
      )
      .subscribe(gid => this.app.openBar('任务添加成功: ' + gid, '查看')
        .onAction()
        .subscribe(_ => this.app.router.navigateByUrl('/list'))
      );
  }

}
