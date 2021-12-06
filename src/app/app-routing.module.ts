import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { IsLoggedIn } from './guards/is.logged.in.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'administrator/authentication', pathMatch: 'full' },
  { path: 'administrator/authentication', canActivate: [LoginGuard], loadChildren: () => import("./components/login/admin-login/admin-login.module").then(m => m.AdminLoginModule) },
  { path: 'admin',canActivate: [AuthGuard, IsLoggedIn], loadChildren: () => import("./layouts/admin/layout.admin.module").then(m => m.LayoutAdminModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
