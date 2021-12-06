import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresTableComponent } from './table/stores.table.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: StoresTableComponent}
]

@NgModule({
  declarations: [
    StoresTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StoresModule { }
