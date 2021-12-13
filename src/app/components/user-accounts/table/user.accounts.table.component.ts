import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { UserAccountsDialogComponent } from "../dialog/user-accounts.dialog.component";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-table',
    templateUrl: './user.accounts.table.component.html',
    styleUrls: ['./user.accounts.table.component.scss']
})

export class UserAccountTableComponent {

    constructor(
        private userAccountsServices: UserAccountsServices,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) { }
    
    title: string = "User-Accounts";
    isTableLoading: boolean = false;
    lblLoading: "Loading..." | "No Data" | "No User Account Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";
    displayedColumns: string[] = [
        'id',
        'first_name',
        'last_name',
        'username',
        'is_active',
        'created_at',
        'actions',
    ];

    dataSource: any;
    pageSizeOption: number[] = [5, 10, 15, 20];
    userAccountsPerPage: number = 5;
    totalUserAccounts: number = 0;
    currentPage = 1;
    searchValue: string = "";
    isSearched: boolean = false;
    @ViewChild("userAccountPaginator") userAccountPaginator: MatPaginator

    ngOnInit(): void {
        this.populateUserAccounts()
    }

    
    populateUserAccounts() {
        this.isTableLoading = true;
        this.lblLoading = "Loading...";
        this.dataSource = new MatTableDataSource<IUserAccountTable>()
        this.userAccountsServices.getUserAccountsWithPaginator(this.currentPage, this.userAccountsPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { data, total } = res;
            if (data.length == 0) { this.lblLoading = "No Data"; }
            this.dataSource.data = data
            this.totalUserAccounts = total;
            this.userAccountPaginator.length = total;
        }, err => {
            const { message } = err;
            switch (message) {
                case "Timeout has occurred":
                    this.lblLoading = "Server cannot be reach. Please Try Again Later";
                    this.isTableLoading = false;
            }

        })
    }

    newUserAccount() {
        this.router.navigate(["/admin/user-accounts/new"])
    }

    editUserAccount(userId: number) {
        this.router.navigate(["/admin/user-accounts/edit", { userId: userId }])
    }

    deactivate(user: any) {
        const { is_active } = user;
        let rootWord;
        if(is_active) {
            rootWord = "Deactivate"
        }
        if(!is_active) {
            rootWord = "Activate"
        }
        
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: `Are you sure you want to ${rootWord} this user account?`,
                action: "deactivateAccount",
                button_name: rootWord,
                user
            }
        }).afterClosed().subscribe(dialogRes => {
            const { id, is_active } = dialogRes;
            let index = this.dataSource.data.findIndex((user: any) => user.id == id);
            this.dataSource.data[index].is_active = is_active;
            this.dataSource.data[index].changed = true;
        })
    }

    resetPassword(user: any) {
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want reset this user account's password?",
                action: "resetPassword",
                button_name: "Reset Password",
                user
            }
        }).afterClosed().subscribe(dialogRes => {
            const { id, isReset } = dialogRes;
            let index = this.dataSource.data.findIndex((user: any) => user.id == id)
            this.dataSource.data[index].isReset = isReset
        })
    }

    searchUserAccount() {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.userAccountPaginator.pageIndex = 0;
            this.populateUserAccounts();
        }
        else {
            this.userAccountsServices.searchUserAccount(this.searchValue).subscribe(res => {
                this.isSearched = true;
                this.isTableLoading = false;
                this.dataSource.data = res
                this.dataSource.paginator = this.userAccountPaginator;
                if (res.length == 0) { this.lblLoading = "No User Account Found" }
            })
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateUserAccounts()
        this.userAccountPaginator.pageIndex = 0;

    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.userAccountsPerPage = pageData.pageSize
            this.populateUserAccounts()
        }

    }
}

interface IUserAccountTable {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    is_active: boolean;
}