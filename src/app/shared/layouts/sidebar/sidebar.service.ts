import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})

export class SidebarServices {
    menu: Imenu = {
        userAccounts: false,
        stores: false,
        members: false,
        earnedRedeemedPoints: false,
        transactions: false,
        generateFile: false
    }

    userAccountSelected(routeModule: string) {
        switch (routeModule) {
            case "user-accounts":
                this.menu = {
                    userAccounts: true,
                    stores: false,
                    members: false,
                    earnedRedeemedPoints: false,
                    transactions: false,
                    generateFile: false
                }
                break;
            case "stores":
                this.menu = {
                    userAccounts: false,
                    stores: true,
                    members: false,
                    earnedRedeemedPoints: false,
                    transactions: false,
                    generateFile: false
                }
                break;
            case "members":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: true,
                    earnedRedeemedPoints: false,
                    transactions: false,
                    generateFile: false
                }
                break;
            case "earned-redeemed-points":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earnedRedeemedPoints: true,
                    transactions: false,
                    generateFile: false
                }
                break;
            case "transactions":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earnedRedeemedPoints: false,
                    transactions: true,
                    generateFile: false
                }
                break;
            case "generate-file":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earnedRedeemedPoints: false,
                    transactions: false,
                    generateFile: true
                }
                break;
        }
    }
}

interface Imenu {
    userAccounts: boolean;
    stores: boolean;
    members: boolean;
    earnedRedeemedPoints: boolean;
    transactions: boolean;
    generateFile: boolean;
}