import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: AdminLoginComponent}
]

@NgModule({
  declarations: [
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminLoginModule { }
