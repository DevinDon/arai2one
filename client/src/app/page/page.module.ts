// src/app/page/page.module.ts

import { NgModule } from '@angular/core';
import { ComponentModule } from '../component/component.module';
import { MaterialModule } from '../module/material.module';
import { SharedModule } from '../module/shared.module';
import { ListComponent } from './list/list.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [ListComponent, SearchComponent],
  imports: [
    SharedModule,
    MaterialModule,
    ComponentModule
  ]
})
export class PageModule { }
