import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutAdminComponent } from "./layout.admin.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedLayoutsModule } from "src/app/shared/layouts/shared.layouts.module";
import { CommonModule } from "@angular/common";
import { NotFoundComponent } from "src/app/components/not-found/not-found.component";
import { SidebarCssSelected } from "src/app/guards/sidebar.css.selected";
import { AdminAccessGuard } from "src/app/guards/admin.access.guard";
import { UnauthorizedComponent } from "src/app/components/unauthorized/unauthorized.component";

const routes: Routes = [
    {
        path: '', component: LayoutAdminComponent,
        children: [
            { path: '', redirectTo: "user-accounts", pathMatch: "full" },
            { path: 'user-accounts', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/user-accounts/user.accounts.module").then(m => m.UserAccountsModule) },
            { path: 'stores', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/stores/stores.module").then(m => m.StoresModule) },
            { path: 'members', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/members/members.module").then(m => m.MembersModule) },
            { path: 'earned-points', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/earned-points/earned.points.module").then(m => m.EarnedPointsModule) },
            { path: 'unauthorized', component: UnauthorizedComponent},
            { path: '**', component: NotFoundComponent },
        ]
    }
]

const MaterialModules = [
    MatSidenavModule
]

@NgModule({
    declarations: [
        LayoutAdminComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModules,
        SharedLayoutsModule,
        CommonModule
    ]
})

export class LayoutAdminModule {

}