import { Component, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { map } from "rxjs/operators";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-table',
    templateUrl: './user.accounts.table.component.html',
    styleUrls: ['./user.accounts.table.component.scss']
})

export class UserAccountTableComponent {

    constructor(
        private userAccountsServices: UserAccountsServices
    ) { }

    title: string = "User-Accounts";
    isTableLoading: boolean = false;
    lblLoading: "Loading..." | "No Data" | "No User Account Found" = "Loading...";
    displayedColumns: string[] = [
        'id',
        'first_name',
        'last_name',
        'username',
        'is_active'
    ];
    dataSource = new MatTableDataSource<IUserAccountTable>();
    pageSizeOption: number[] = [5, 10, 15, 20];
    userAccountsPerPage: number = 5;
    totalUserAccounts: number = 0;
    currentPage = 1;
    searchValue: string = "";
    @ViewChild("userAccountPaginator") userAccountPaginator: MatPaginator

    ngOnInit(): void {
        this.populateUserAccounts()
    }
    ngAfterViewInit(): void {
    }

    populateUserAccounts() {
        this.isTableLoading = true;
        this.userAccountsServices.getUserAccountsWithPaginator(this.currentPage, this.userAccountsPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { data, total } = res
            if (data.length > 0) { this.lblLoading = "No Data"; }
            this.dataSource.data = data
            this.totalUserAccounts = total;
        }, err => {
            alert(err)
        })
    }

    searchUserAccount() {
        this.isTableLoading = true;
        this.userAccountsServices.searchUserAccount(this.searchValue).subscribe(res => {
            this.isTableLoading = false;
            console.log(res)
            this.dataSource.data = res
            if(res.length == 0) { this.lblLoading = "No User Account Found" }
        })
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.userAccountsPerPage = pageData.pageSize
        this.populateUserAccounts()
    }
}

interface IUserAccountTable {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    is_active: boolean;
}