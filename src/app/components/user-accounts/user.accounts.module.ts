import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountTableComponent } from './table/user.accounts.table.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: UserAccountTableComponent },
]

@NgModule({
  declarations: [
    UserAccountTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserAccountsModule { }
