import { Component, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MembersServices } from "../members.service";

@Component({
    selector: 'app-members-table',
    templateUrl: './members.table.component.html',
    styleUrls: ['./members.table.component.scss']
})

export class MembersTableComponent {
    constructor(
        private membersServices: MembersServices
    ) { }
    title: string = "Members";
    searchValue: string = "";
    isTableLoading: boolean = false;
    dataSource = new MatTableDataSource<IMemberDataSource>()
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
    lblLoading: "Loading..." | "No Data" | "No Store Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";
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
            console.log(data)
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
                if (data.length == 0) { this.lblLoading = "No Store Found" }
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

    }

    activateInactivate(action: string, memberId: number) {

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
    created_at: string;
}