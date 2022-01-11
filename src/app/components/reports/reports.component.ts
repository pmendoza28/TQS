import { Component } from "@angular/core";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})

export class ReportsComponent {

    /** @States */
    title: string = "Reports"
    reports: string[] = [
        "User-Accounts",
        "Stores",
        "Members",
        "Earned-Points",
        "Redeemed-Points",
    ]
}