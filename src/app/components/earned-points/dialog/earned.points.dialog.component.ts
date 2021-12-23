import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HelperServices } from "src/app/shared/services/helpers.service";
const CryptoJS = require("crypto-js");
@Component({
    selector: 'app-earned-points-dialog',
    templateUrl: './earned.points.dialog.component.html',
    styleUrls: ['./earned.points.dialog.component.scss']
})

export class EarnedPointsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<EarnedPointsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private helperServices: HelperServices
    ) {}
    earnedPoints: any[] = []
    dataSource = new MatTableDataSource<IEarnedPointsDataSource>()
    readyToUpload: boolean = false;
    fileUploadForm: FormGroup = this.fb.group({
        earnedPoints: []
    })
    displayedColumns: string[] = [
        'row',
        'member_id',
        'transaction_no',
        'amount',
        'points_earn',
        'transaction_datetime',
    ]

    ngOnInit(): void {
        console.log(this.data)
    }
    
    applyFilter(event: Event) {
        this.helperServices.filterTable(event, this.dataSource)
    }

    import() {
        const { earnedPoints } = this.fileUploadForm.value
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(earnedPoints)
        fileReader.onload = (event) => {
            const result: any = event.target?.result
            const resultObj = JSON.parse(result)
            console.log(resultObj)
            // const { data, details } = resultObj;
            var earnedPoints  = CryptoJS.AES.decrypt(resultObj[0], 'secret key 123');
            var details  = CryptoJS.AES.decrypt(resultObj[1], 'secret key 123');

            var originalEarnedPoints = JSON.parse(earnedPoints.toString(CryptoJS.enc.Utf8))
            var originalDetails = JSON.parse(details.toString(CryptoJS.enc.Utf8))
            console.log(originalEarnedPoints)
            originalEarnedPoints.forEach((earnPoint: IEarnedPointsDataSource, index: number) => {
                this.dataSource.data.push({
                    row: index + 1,
                    member_id: earnPoint.member_id,
                    transaction_no: earnPoint.transaction_no,
                    amount: earnPoint.amount,
                    points_earn: earnPoint.points_earn,
                    transaction_datetime: earnPoint.transaction_datetime
                })
            })
            
        }
    }
}

interface IEarnedPointsDataSource {
    row: number;
    member_id: number;
    transaction_no: string;
    amount: number;
    points_earn: number;
    transaction_datetime: string;
}