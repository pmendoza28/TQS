import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { EarnedPointsDialogComponent } from "../dialog/earned.points.dialog.component";
import { EarnedPointsServices } from "../earned.points.service";

@Component({
    selector: 'app-earned-points',
    templateUrl: './earned.points.table.component.html',
    styleUrls: ['./earned.points.table.component.scss']
})

export class EarnedPointsTableComponent {
    constructor(
        private earnedPointsServices: EarnedPointsServices,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.populateEarnedPointsWithPaginator()
    }

    title: string = "Earned Points";
    searchValue: string = "";
    isTableLoading: boolean = false;
    isSearched: boolean = false;
    currentPage = 1;
    @ViewChild("earnedPointsPaginator") memberPaginator: MatPaginator
    dataSource = new MatTableDataSource<any>()
    displayedColumns: string[] = [
        "id",
        "transaction_no",
        "first_name",
        "last_name",
        "mobile_number",
        "amount",
        "points_earn",
        "transaction_datetime",
        "actions",
    ]
    lblLoading: "Loading..." | "No Data" | "No Member Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";
    pageSizeOption: number[] = [5, 10, 15, 20];
    earnedPointsPerPage: number = 5;
    totalMembers: number = 0;

    populateEarnedPointsWithPaginator() {
        this.isTableLoading = true;
        this.earnedPointsServices.getEarnedPointsWithPaginator(this.currentPage, this.earnedPointsPerPage).subscribe(res => {
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

    searchEarnedPoints(isOnPage: boolean) {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.memberPaginator.pageIndex = 0;
            this.populateEarnedPointsWithPaginator();
        }
        else {
            if (!isOnPage) {
                this.currentPage = 1;
                this.memberPaginator.pageIndex = 0;
            }
            this.earnedPointsServices.searchEarnedPoints(this.searchValue, this.currentPage, this.earnedPointsPerPage).subscribe((res: any) => {
                const { data, total } = res;
                this.isSearched = true;
                this.isTableLoading = false;
                this.dataSource.data = data
                this.memberPaginator.length = total
                if (data.length == 0) { this.lblLoading = "No Member Found" }
            })
        }
    }

    
    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.earnedPointsPerPage = pageData.pageSize
            this.populateEarnedPointsWithPaginator()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.earnedPointsPerPage = pageData.pageSize
            this.searchEarnedPoints(true)
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateEarnedPointsWithPaginator()
        this.memberPaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    upload() {
        this.dialog.open(EarnedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Import Earned Points",
                action: "import-earned-points"
            }
        })
    }
}