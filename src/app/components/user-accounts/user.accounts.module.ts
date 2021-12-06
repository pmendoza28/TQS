import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountTableComponent } from './table/user.accounts.table.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  { path: '', component: UserAccountTableComponent },
]

@NgModule({
  declarations: [
    UserAccountTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule
  ]
})
export class UserAccountsModule { }
