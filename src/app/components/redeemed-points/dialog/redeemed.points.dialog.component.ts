import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RedeemService } from "../redeem/redeem.service";

@Component({
    selector: 'app-redeemed-points-dialog',
    templateUrl: './redeemed.points.dialog.component.html',
    styleUrls: ['./redeemed.points.dialog.component.scss']
})

export class RedeemedPointsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<RedeemedPointsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private redeemServices: RedeemService,
        private snackbar: MatSnackBar
    ) {}

    isRedeeming: boolean = false;

    redeem() {
        this.isRedeeming = true;
        this.redeemServices.redeem(this.data.redeemForm, this.data.token).subscribe(res => {
            console.log(res)
            this.dialogRef.close({isRedeemed: true, reference_no: res.reference_no})
        }, err => {
            console.log(err)
            this.snackbar.open("Unauthorized", "", {
                duration: 3000
            })
            this.dialogRef.close({ isRedeemed: false })
        })
    }

    cancel() {
        this.dialogRef.close({isRedeemed: false})
    }
}