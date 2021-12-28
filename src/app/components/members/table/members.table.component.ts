import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MembersDialogComponent } from "../dialog/members.dialog.component";
import { MembersServices } from "../members.service";

@Component({
    selector: 'app-members-table',
    templateUrl: './members.table.component.html',
    styleUrls: ['./members.table.component.scss']
})

export class MembersTableComponent {
    constructor(
        private membersServices: MembersServices,
        private router: Router,
        private dialog: MatDialog
    ) { }
    title: string = "Members";
    searchValue: string = "";
    isTableLoading: boolean = false;
    dataSource = new MatTableDataSource<any>()
    displayedColumns: string[] = [
        "id",
        "first_name",
        "last_name",
        "gender",
        "birthday",
        "barangay",
        "municipality",
        "province",
        "email",
        "mobile_number",
        "status",
        "created_at",
        "actions",
    ]
    lblLoading: "Loading..." | "No Data" | "No Member Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";
    isSearched: boolean = false;
    pageSizeOption: number[] = [5, 10, 15, 20];
    memberPerPage: number = 5;
    totalMembers: number = 0;
    @ViewChild("memberPaginator") memberPaginator: MatPaginator
    currentPage = 1;

    ngOnInit(): void {
        this.populateMembersWithPaginator()
    }

    ngDoCheck(): void {
        this.checkSearchValue()
    }

    checkSearchValue() {
        if (this.searchValue == "") {
            if (this.isSearched) {
                this.clearSearch()
            }
        }
    }

    populateMembersWithPaginator() {
        this.isTableLoading = true;
        this.membersServices.getMembersWithPaginator(this.currentPage, this.memberPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { data, total } = res;
            if (data.length == 0) { this.lblLoading = "No Data"; }
            this.dataSource.data = data;
            this.totalMembers = total;
            this.memberPaginator.length = total;
        }, err => {
            const { message } = err;
            switch (message) {
                case "Timeout has occurred":
                    this.lblLoading = "Server cannot be reach. Please Try Again Later";
                    this.isTableLoading = false;
            }
        })
    }

    newMember() {
        this.router.navigate(["/admin/members/new"])
    }

    searchMember(isOnPage: boolean) {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.memberPaginator.pageIndex = 0;
            this.populateMembersWithPaginator();
        }
        else {
            if (!isOnPage) {
                this.currentPage = 1;
                this.memberPaginator.pageIndex = 0;
            }
            this.membersServices.searchMember(this.searchValue, this.currentPage, this.memberPerPage).subscribe(res => {
                const { data, total } = res;
                this.isSearched = true;
                this.isTableLoading = false;
                this.dataSource.data = data
                this.memberPaginator.length = total
                if (data.length == 0) { this.lblLoading = "No Member Found" }
            })
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateMembersWithPaginator()
        this.memberPaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    editMember(memberId: number) {
        this.router.navigate(["/admin/members/edit", { memberId}])
    }

    activateInactivate(action: string, member: any) {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: `Are you sure want to ${action} this store?`,
                action: "activeInActive",
                button_name: action,
                member
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { memberId, status } = dialogResponse;
            if(status) {
                let index = this.dataSource.data.findIndex((member: any) => member.id == memberId)
                this.dataSource.data[index].status = status;
                this.dataSource.data[index].hasChanged = true;
            }
            
        })
    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.memberPerPage = pageData.pageSize
            this.populateMembersWithPaginator()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.memberPerPage = pageData.pageSize
            this.searchMember(true)
        }
    }

    upload() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Import Members",
                action: "import-members-validation"
            }
        }).afterClosed().subscribe(dialogResponse => {
            if(dialogResponse) {
                const { imported_members } = dialogResponse;
                if(imported_members) {
                    if(imported_members.length > 0) {
                        this.populateMembersWithPaginator()
                        
                    }
                }
            }
        })
    }
}

interface IMemberDataSource {
    id: number;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    barangay: string;
    municipality: string;
    province: string;
    email: string;
    mobile_number: string;
    status: string;
    created_at?: string;
    hasChanged?: boolean
}