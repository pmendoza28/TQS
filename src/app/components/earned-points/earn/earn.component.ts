import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { EarnService } from "./earn.service";
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { EarnedPointsDialogComponent } from "../dialog/earned.points.dialog.component";
@Component({
    selector: 'app-earn',
    templateUrl: './earn.component.html',
    styleUrls: ['./earn.component.scss']
})

export class EarnPointsComponent {
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private credServices: CredServices,
        private earnServices: EarnService,
        private snackbar: MatSnackBar,
        @Inject(PLATFORM_ID) private platformId: Object,
        private dialog: MatDialog
    ) { }

    earningPointsSettings: any;
    isMobileNumberExists: boolean = false;

    @ViewChild("txtMobileNumber") txtMobileNumber: ElementRef
    @ViewChild("txtTransactionNo") txtTransactionNo: ElementRef

    ngOnInit(): void {
        this.getUpdatedEearningPointsPercentage()
        console.log(this.credServices.getCredentials())
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.txtMobileNumber.nativeElement.focus()
        }
    }

    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }

    getUpdatedEearningPointsPercentage() {
        this.earnServices.getUpdatedEarningPointsPercentage().subscribe(res => {
            this.earningPointsSettings = res;
            this.earnForm.patchValue({ based_computation: res.earning_percentage })
        })
    }

    memberObject: any;
    checkMobileNumber() {
        const { mobile_number } = this.earnForm.value;
        if (mobile_number.length == 11) {
            this.earnServices.validateMobileNumber(mobile_number).subscribe(res => {
                console.log(res)
                const { isExists, member } = res;
                this.memberObject = member;
                 this.isMobileNumberExists = isExists
                this.earnForm.controls.mobile_number.disable()
                this.txtTransactionNo.nativeElement.focus()

            }, err => {
                console.log(err)
                const { error: { message, isExists } } = err;
                this.isMobileNumberExists = isExists;
                this.snackbar.open(message, "", { duration: 3000 })
               
            })
        }
    }

    earnForm: FormGroup = this.fb.group({
        store_mysql_id: [''],
        mobile_number: [],
        member_id: [''],
        transaction_no: [''],
        based_computation: [''],
        bought_amount: [''],
        earned_points: [''],
    })

    earnPointsPercentage() {
        return this.earnForm.value.bought_amount * this.earnForm.value.based_computation;
    }

    validateForm() {
        const { transaction_no, bought_amount } = this.earnForm.value;
        if (transaction_no == '' || Number(bought_amount) <= 0 || this.isPointsEarned == true) {
            return true
        }
        return false;
    }

    isPointsEarned: boolean = false;
    earn() {
        this.earnForm.patchValue({ 
            store_mysql_id: this.credServices.getCredentials().activated_store.store_mysql_id,
            earned_points: this.earnPointsPercentage(),
            bought_amount: Number(this.earnForm.value.bought_amount),
            member_id: this.memberObject._id
        })
        this.dialog.open(EarnedPointsDialogComponent, {
            disableClose: true,
            data: {
                earnForm: this.earnForm.value,
                title: "Confirmation",
                question: "Are you sure you want to earn this points?",
                action: 'earn-points',
                button_name: 'Earn',
            }
        }).afterClosed().subscribe(dialogResponse => {
            console.log(dialogResponse)
            const { isEarned } = dialogResponse;
            this.isPointsEarned = isEarned
            if(isEarned) {
                // this.earnForm.disable()
                this.router.navigate(['/client/transactions'])
            }
        })
    }

    reset() {
        this.earnForm.patchValue({
            mobile_number: '',
            transaction_no: '',
            bought_amount: '',
            earned_points: ''
        })
        this.isPointsEarned = false;
        this.isMobileNumberExists = false;
        this.earnForm.enable()
        this.getUpdatedEearningPointsPercentage()
    }

    back() {
        this.router.navigate(['/client/transactions'])
    }

    isEarning: boolean = false;
}