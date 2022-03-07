import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppServices } from "src/app/app.service";
import { CredServices } from "src/app/shared/services/cred.service";

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent {
    constructor(
        public credServices: CredServices,
        public appServices: AppServices,
        private router: Router
    ) {}
    
    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }
    redeem() {
        if(this.appServices.internetForm.value.isOnline) {
            this.router.navigate(['/client/transactions/redeem-points'])
        }
    }
}