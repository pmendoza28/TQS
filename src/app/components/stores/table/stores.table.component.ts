import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { StoresDialogComponent } from "../dialog/stores.dialog.component";
import { StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-table',
    templateUrl: './stores.table.component.html',
    styleUrls: ['./stores.table.component.scss']
})

export class StoresTableComponent {

    constructor(
        private storesServices: StoresServices,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    title: string = "Stores";
    searchValue: string = "";
    isSearched: boolean = false;
    pageSizeOption: number[] = [5, 10, 15, 20];
    storesPerPage: number = 5;
    totalStores: number = 0;
    currentPage = 1;
    dataSource = new MatTableDataSource<IStoreDataSource>();
    isTableLoading: boolean = false;
    lblLoading: "Loading..." | "No Data" | "No Store Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";
    @ViewChild("storePaginator") storePaginator: MatPaginator
    displayedColumns: string[] = [
        'id',
        'code',
        'name',
        'area',
        'region',
        'cluster',
        'business_model',
        'is_active',
        'created_at',
        'actions',
    ];

    checkSearchValue() {
        if(this.searchValue == "") {
            if(this.isSearched) {
                this.clearSearch()
            }
        }
    }

    ngOnInit(): void {
        this.populateStoresWithPaginator()
    }

    ngDoCheck(): void {
        this.checkSearchValue()
    }

    populateStoresWithPaginator() {
        this.isTableLoading = true;
        this.lblLoading = "Loading...";
        this.storesServices.getStoresWithPaginator(this.currentPage, this.storesPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { data, total } = res;
            if (data.length == 0) { this.lblLoading = "No Data"; }
            this.dataSource.data = data;
            this.totalStores = total;
            this.storePaginator.length = total;
        }, err => {
            const { message } = err;
            switch (message) {
                case "Timeout has occurred":
                    this.lblLoading = "Server cannot be reach. Please Try Again Later";
                    this.isTableLoading = false;
            }
        })
    }

    searchStore(isOnPage: boolean) {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.storePaginator.pageIndex = 0;
            this.populateStoresWithPaginator();
        }
        else {
            if(!isOnPage) {
                this.currentPage = 1;
                this.storePaginator.pageIndex = 0;
             }
            this.storesServices.searchStore(this.searchValue, this.currentPage, this.storesPerPage).subscribe(res => {
                const { data, total } = res;
                this.isSearched = true;
                this.isTableLoading = false;
                this.dataSource.data = data
                this.storePaginator.length = total
                if (data.length == 0) { this.lblLoading = "No Store Found" }
            })
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateStoresWithPaginator()
        this.storePaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    editStore(storeId: number) {
        this.router.navigate(["/admin/stores/edit/", {storeId}])
    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.storesPerPage = pageData.pageSize
            this.populateStoresWithPaginator()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.storesPerPage = pageData.pageSize
            this.searchStore(true)
        }
    }

    newStore() {
        this.router.navigate(["/admin/stores/new"])
    }

    activateInactivate(action: string, storeId: number) {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: `Are you sure want to ${action} this store?`,
                action: "activeInActive",
                button_name: action,
                storeId
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { storeId, status } = dialogResponse;
            if(status) {
                let index = this.dataSource.data.findIndex((store: any) => store.id == storeId)
                this.dataSource.data[index].status = status;
                this.dataSource.data[index].hasChanged = true;
            }
            
        })
        
    }

    copyToken(code: number) {
        this.snackBar.open(`Code # ${code}`, `Token Copied to Clipboard`, { duration: 3000 })
    }
}

interface IStoreDataSource {
    id: number;
    code: string;
    name: string;
    area: string;
    region: string;
    cluster: string;
    business_model: string;
    created_at: string;
    status: string;
    hasChanged?: boolean
}