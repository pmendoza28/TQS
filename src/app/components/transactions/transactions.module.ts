import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MembersRegisterComponent } from "../members/register/members.register.component";
import { TransactionsComponent } from "./transactions.component";

const routes: Routes = [
    { path: '', component: TransactionsComponent}, 
    { path: 'register-customer', loadChildren: () => import("../members/register/members.register.module").then(m => m.MembersRegisterModule) }
]

@NgModule({
    declarations: [
        TransactionsComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class TransactionsModule {

}