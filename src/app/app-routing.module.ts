import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'administrator/authentication', pathMatch: 'full' },
  { path: 'administrator/authentication', loadChildren: () => import("./components/login/admin-login/admin-login.module").then(m => m.AdminLoginModule) },
  { path: 'admin', loadChildren: () => import("./layouts/admin/layout.admin.module").then(m => m.LayoutAdminModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
