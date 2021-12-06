import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MembersTableComponent } from './table/members.table.component';

const routes: Routes = [
  { path: '', component: MembersTableComponent}
]

@NgModule({
  declarations: [
    MembersTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MembersModule { }
