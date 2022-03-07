import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { TransactionPointsService } from "./transaction.points.service";

@Component({
    selector: 'app-transaction-points',
    templateUrl: './transaction.points.component.html',
    styleUrls: ['./transaction.points.component.scss']
})

export class TransactionPointsComponent {
    constructor(
        private credServices: CredServices,
        private router: Router,
        private helperServices: HelperServices,
        private transactionPointsServices: TransactionPointsService
    ) {}

    ngOnInit(): void {
        this.populateEarnedPoints()
    }

    @ViewChild('pendingPaginator') pendingPaginator : MatPaginator
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.pendingPaginator
    }
    populateEarnedPoints() {
        this.transactionPointsServices.getEarnedPoints().subscribe(res => {
            console.log(res)
            this.dataSource.data = res.map((earnedPoint: any) => {
                return {
                    transaction_no: earnedPoint.transaction_no,
                    mobile_number: earnedPoint.memberData.mobile_number,
                    name: `${earnedPoint.memberData.first_name} ${earnedPoint.memberData.last_name}`,
                    bought_amount: earnedPoint.bought_amount,
                    earned_points: earnedPoint.earned_points,
                    date_earned: earnedPoint.date_earned
                }
            })
        })
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
    ]

    dataSource = new MatTableDataSource<IPendingEarningPointsDataSource>()
}

interface IPendingEarningPointsDataSource {
    transaction_no: string;
    mobile_number: string;
    name: string;
    bought_amount: number;
    earned_points: number;
    date_earned: string;
}