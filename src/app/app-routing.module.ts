import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'administrator/authentication', pathMatch: 'full' },
  { path: 'administrator/authentication', loadChildren: () => import("./components/login/admin-login/admin-login.module").then(m => m.AdminLoginModule) },
  { path: 'admin',canActivate: [AuthGuard], loadChildren: () => import("./layouts/admin/layout.admin.module").then(m => m.LayoutAdminModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
