import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutAdminComponent } from "./layout.admin.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedLayoutsModule } from "src/app/shared/layouts/shared.layouts.module";
import { CommonModule } from "@angular/common";
import { NotFoundComponent } from "src/app/components/not-found/not-found.component";

const routes: Routes = [
    {
        path: '', component: LayoutAdminComponent,
        children: [
            { path: '', redirectTo: "user-accounts", pathMatch: "full" },
            { path: 'user-accounts', loadChildren: () => import("../../components/user-accounts/user.accounts.module").then(m => m.UserAccountsModule) },
            { path: '**', component: NotFoundComponent }
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