import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({
    providedIn: "root"
})

export class SidebarServices {
    constructor(
        private titleServices: Title
    ) { }
    menu: Imenu = {
        userAccounts: false,
        stores: false,
        members: false,
        earned_points: false,
        redeemed_points: false,
        transactions: false,
        generateFile: false,
        reports: false
    }

    userAccountSelected(routeModule: string) {
        this.titleServices.setTitle(`TQS | ${routeModule}`)
        switch (routeModule) {
            case "user-accounts":
                this.menu = {
                    userAccounts: true,
                    stores: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "stores":
                this.menu = {
                    userAccounts: false,
                    stores: true,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "members":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: true,
                    earned_points: false,
                    redeemed_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "earned-points":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earned_points: true,
                    redeemed_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "redeemed-points":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: true,
                    transactions: true,
                    generateFile: false,
                    reports: false
                }
                break;
            case "transactions":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    transactions: true,
                    generateFile: false,
                    reports: false
                }
                break;
            case "generate-file":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    transactions: false,
                    generateFile: true,
                    reports: false
                }
                break;
            case "reports":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: true
                }
                break;
        }
    }
}

interface Imenu {
    userAccounts: boolean;
    stores: boolean;
    members: boolean;
    earned_points: boolean;
    redeemed_points: boolean;
    transactions: boolean;
    generateFile: boolean;
    reports: boolean;
}