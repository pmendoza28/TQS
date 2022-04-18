import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AppServices } from "src/app/app.service";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { GenerateFileClientService } from "../generate-file-client/generate.file.client.service";
import { UpdateFileService } from "../update-file/update.file.service";
import { TransactionPointsDialogComponent } from "./dialog/transaction.points.dialog.component";
import { TransactionPointsService } from "./transaction.points.service";

@Component({
    selector: 'app-transaction-points',
    templateUrl: './transaction.points.component.html',
    styleUrls: ['./transaction.points.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class TransactionPointsComponent {
    constructor(
        private credServices: CredServices,
        private router: Router,
        private helperServices: HelperServices,
        private transactionPointsServices: TransactionPointsService,
        private generateFileClientServices: GenerateFileClientService,
        private updateFileService: UpdateFileService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        public appServices: AppServices
    ) { }

    isSynching: boolean = false;

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.key == "Escape") {
            this.router.navigate(["/client/transactions"])
        }
    }

    sync() {
        this.isSynching = true;
        this.generateFileClientServices.generateFile().subscribe(res => {
            res['generate'].map((data: any) => data.earnedPoints.map((earnedPoint: any) => earnedPoint.category = "Synched"))
            this.transactionPointsServices.sync({ data: res['generate'], store_token: this.credServices.getCredentials().activated_store.token }, this.credServices.getCredentials().activated_store.store_mysql_id).subscribe((updateFileResponse: any) => {
                const { status, body: { insertedData, earnedPointsAlreadyExists } } = updateFileResponse;
                if (status == 200) {
                    let updateFile = {
                        earnedpointdata: insertedData.earnedPoints,
                        memberdata: insertedData.member,
                    }

                    let invalidFile = {
                        earnedpointdata: earnedPointsAlreadyExists,
                        memberdata: insertedData.member,
                    }
                    if(earnedPointsAlreadyExists.length > 0) {
                        this.updateFileService.updateClientFile(invalidFile).subscribe((updateFileClientResponse: any) => {
                            this.isSynching = false;
                            this.snackbar.open("Earned Points are succesfully sync", "", { duration: 3000 })
                            this.populateEarnedPoints();
                        })
                    }
                    
                    this.updateFileService.updateClientFile(updateFile).subscribe((updateFileClientResponse: any) => {
                        this.isSynching = false;
                        this.snackbar.open("Earned Points are succesfully sync", "", { duration: 3000 })
                        this.populateEarnedPoints();
                    })
                }
            })
        })
    }

    validateRemoveVoid() {
        let hasVoidTransactions = this.dataSource.data.filter((dt: any) => dt.void_remove == false && dt.void_by != null && dt.void_date != null).length
        return hasVoidTransactions > 0 ? true : false;
    }

    isRemovingVoid: boolean = false;
    buttonRemove: "Remove Void" | "Removing Void Transactions..." = "Remove Void";
    removeVoid() {
        this.isRemovingVoid = true;
        this.buttonRemove = "Removing Void Transactions...";
        this.transactionPointsServices.removeVoid().subscribe(res => {
            this.isRemovingVoid = false;
            this.buttonRemove = "Remove Void";
            this.populateEarnedPoints()
        })
    }

    ngOnInit(): void {
        this.populateEarnedPoints()
        this.populateSynchedEarnedPoints()
        this.populateRedeemedPoints()
        this.getVoidedEarnedPoints()
    }

    @ViewChild('pendingPaginator') pendingPaginator: MatPaginator
    @ViewChild('synchPaginator') synchPaginator: MatPaginator
    @ViewChild(MatTable) table: MatTable<any>
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.pendingPaginator
        this.voidedEarnedPointsDataSource.paginator = this.voidedEarnedPointsPaginator
    }

    populateEarnedPoints() {
        this.transactionPointsServices.getEarnedPoints().subscribe(res => {
            this.dataSource.data = res.map((earnedPoint: any) => {
                return {
                    _id: earnedPoint._id,
                    transaction_no: earnedPoint.transaction_no,
                    mobile_number: earnedPoint.memberData.mobile_number,
                    name: `${earnedPoint.memberData.first_name} ${earnedPoint.memberData.last_name}`,
                    bought_amount: earnedPoint.bought_amount,
                    earned_points: earnedPoint.earned_points,
                    date_earned: earnedPoint.date_earned,
                    void_by: earnedPoint.void_by,
                    void_date: earnedPoint.void_date,
                    void_remove: earnedPoint.void_remove
                }
            })
        })
    }

    synchedSearchValue: string = "";
    synchedEarnedPointsCurrentPage: number = 1;
    synchedItemsPerPage: number = 5;
    lblLoadingSyncEarnedPoints: "Loading..." | "No Data" | "No Data Found" = "Loading...";
    totalSyncEarnedPoints: number = 0;
    populateSynchedEarnedPoints() {
        this.transactionPointsServices.getSynchedEarnedPoints({ searchValue: this.synchedSearchValue, currentPage: this.synchedEarnedPointsCurrentPage, itemsPerPage: this.synchedItemsPerPage }).subscribe(res => {
            const { status, body: { data, total } } = res;
            if (status == 200) {
                if (data.length == 0) this.lblLoadingSyncEarnedPoints = "No Data";
                this.synchedDataSource.data = data
                this.totalSyncEarnedPoints = total
            }
        })
    }

    populateRedeemedPoints() {
        this.transactionPointsServices.getRedeemedPoints({ searchValue: this.RedeemedSearchValue, currentPage: this.RedeemedPointsCurrentPage, itemsPerPage: this.RedeemedItemsPerPage }).subscribe(res => {
            const { status } = res;
            if (status == 200) {
                if(res.body == null) {
                    this.lblLoadingRedeemedPoints = "No Data"
                }
                else {
                    this.redeemedDataSource.data = res.body.data
                    this.totalRedeemedPoints = res.body.total;
                }
            }
        })
    }

    lblLoadingVoidedRedeemedPoints : "Loading..." | "No Data" | "No Data Found" = "Loading..."
    voidedEarnedPointsDataSource = new MatTableDataSource<any>()
    totalVoidedEarnedPoints: number = 0;
    @ViewChild('voidedEarnedPointsPaginator') voidedEarnedPointsPaginator: MatPaginator
    getVoidedEarnedPoints() {
        this.transactionPointsServices.getVoidedEarnedPoints().subscribe(res => {
            console.log(res)
            const { status, body } = res;
            if(status == 200) {
                if(res.body == null) {
                    this.lblLoadingVoidedRedeemedPoints = "No Data"
                }
                else {
                    this.voidedEarnedPointsDataSource.data = res.body
                    this.voidedEarnedPointsDataSource.paginator = this.voidedEarnedPointsPaginator
                }
            }

        })
    }
    filterVoidedEarnedPoints(event: Event) {
        this.helperServices.filterTable(event, this.voidedEarnedPointsDataSource)
    }

    filterSynchedEarnedPoints() {
        this.synchedDataSource.data = []
        this.lblLoadingSyncEarnedPoints = "Loading..."
        this.transactionPointsServices.getSynchedEarnedPoints({ searchValue: this.synchedSearchValue, currentPage: this.synchedEarnedPointsCurrentPage, itemsPerPage: this.synchedItemsPerPage }).subscribe(res => {
            const { status, body: { data, total } } = res;
            if (status == 200) {
                if (data.length == 0) this.lblLoadingSyncEarnedPoints = "No Data Found";
                this.synchedDataSource.data = data
                this.totalSyncEarnedPoints = total
            }
        })
    }

    synchedOnChangePage(pageData: PageEvent) {
        this.synchedEarnedPointsCurrentPage = pageData.pageIndex + 1;
        this.synchedItemsPerPage = pageData.pageSize
        this.populateSynchedEarnedPoints()
    }

    filter(event: Event) {
        this.helperServices.filterTable(event, this.dataSource)
    }

    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }

    back() {
        this.router.navigate(['/client/transactions'])
    }

    tabLoadTimes: Date[] = [];

    getTimeLoaded(index: number) {
        if (!this.tabLoadTimes[index]) {
            this.tabLoadTimes[index] = new Date();
        }

        return this.tabLoadTimes[index];
    }

    value = '';

    displayedColumns: string[] = [
        'transaction_no',
        'mobile_number',
        'name',
        'bought_amount',
        'earned_points',
        'date_earned',
        'actions',
    ]

    synchedDisplayedColumns: string[] = [
        'transaction_no',
        'mobile_number',
        'name',
        'bought_amount',
        'earned_points',
        'date_earned',
        // 'actions',
    ]

    displayedVoidedEarnedPointsColumns: string[] = [
        'transaction_no',
        'mobile_number',
        'name',
        'bought_amount',
        'earned_points',
        'date_earned',
    ]

    dataSource = new MatTableDataSource<IPendingEarningPointsDataSource>();
    synchedDataSource = new MatTableDataSource<any>()

    void(earnedId: any) {
        this.dialog.open(TransactionPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Type VOID to proceed",
                action: "void",
                earnedId
            }
        }).afterClosed().subscribe(res => {
            if (res.isVoided) {
                const { _id, void_by, void_date } = res;
                let index = this.dataSource.data.findIndex((dt: any) => dt._id == _id)
                this.dataSource.data[index].void_by = void_by;
                this.dataSource.data[index].void_date = void_date;
                this.table.renderRows()
            }
        })
    }

    validateSync() {
        const result = this.dataSource.data.filter((dt: IPendingEarningPointsDataSource) => dt.void_by == null && dt.void_date == null).length > 0 ? true : false;
        return result

    }

    redeemedDataSource = new MatTableDataSource<any>();
    RedeemedSearchValue: string = "";
    RedeemedPointsCurrentPage: number = 1;
    RedeemedItemsPerPage: number = 5;
    lblLoadingRedeemedPoints: "Loading..." | "No Data" | "No Data Found" = "Loading...";
    totalRedeemedPoints: number = 0;

    redeemedDisplayedColumns: string[] = [
        'mobile_number',
        'name',
        'redeemed_points',
        'date_redeemed'
    ]

    redeemedOnChangePage(pageData: PageEvent) {
        this.RedeemedPointsCurrentPage = pageData.pageIndex + 1;
        this.RedeemedItemsPerPage = pageData.pageSize
        this.populateRedeemedPoints()
    }
}

interface IPendingEarningPointsDataSource {
    transaction_no: string;
    mobile_number: string;
    name: string;
    bought_amount: number;
    earned_points: number;
    date_earned: string;
    void_by: string;
    void_date: string;
}