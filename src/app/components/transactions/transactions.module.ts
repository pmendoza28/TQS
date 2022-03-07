import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MembersRegisterComponent } from "../members/register/members.register.component";
import { TransactionsComponent } from "./transactions.component";
import { TransactionsGuard } from "./transactions.guard";

const routes: Routes = [
    { path: '', component: TransactionsComponent },
    { path: 'register-customer', loadChildren: () => import("../members/register/members.register.module").then(m => m.MembersRegisterModule) },
    { path: 'earn-points', loadChildren: () => import("../earned-points/earn/earn.module").then(m => m.EarnModule) },
    { path: 'redeem-points', canActivate: [TransactionsGuard], loadChildren: () => import("../redeemed-points/redeem/redeem.module").then(m => m.RedeemModule) },
    { path: 'transaction-points', loadChildren: () => import("../transaction-points/transaction.points.module").then(m => m.TransactionPointModule) },
]

@NgModule({
    declarations: [
        TransactionsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ]
})

export class TransactionsModule {

}