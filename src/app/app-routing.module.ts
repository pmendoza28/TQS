import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { IsLoggedIn } from './guards/is.logged.in.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '',redirectTo: 'portal/getting-started', pathMatch: 'full' },
  { path: 'portal', loadChildren: () => import("./components/portal/portal.module").then(m => m.PortalModule) },
  { path: 'sandbox', loadChildren: () => import("./sandbox/sandbox.module").then(m => m.SandboxModule) },
  { path: 'administrator/authentication', canActivate: [LoginGuard], loadChildren: () => import("./components/login/admin-login/admin-login.module").then(m => m.AdminLoginModule) },
  { path: 'login', loadChildren: () => import('./components/login/client/client.login.module').then(m => m.ClientLoginModule) },
  { path: 'admin', canActivate: [AuthGuard, IsLoggedIn], loadChildren: () => import("./layouts/admin/layout.admin.module").then(m => m.LayoutAdminModule) },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
