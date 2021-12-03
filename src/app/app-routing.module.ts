import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'administrator/authentication', pathMatch: 'full' },
  { path: 'administrator/authentication', loadChildren: () => import("./components/login/admin-login/admin-login.module").then(m => m.AdminLoginModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
