import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss']
})
export class AddTaskDialogComponent implements OnInit {

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      name: new FormControl(''),
      uri: new FormControl('', [Validators.required, Validators.maxLength(5000)])
    });
  }

  ngOnInit() { }

}
