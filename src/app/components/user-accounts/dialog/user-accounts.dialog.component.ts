import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-dialog',
    templateUrl: './user-accounts.dialog.component.html',
    styleUrls: ['./user-accounts.dialog.component.scss']
})

export class UserAccountsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<UserAccountsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userAccountServices: UserAccountsServices,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    isButtonLoading: boolean = false;

    

    create() {
        this.isButtonLoading = true;
        this.data.button_name = "Creating..";
        this.userAccountServices.createUserAccount(this.data.userAccountForm).subscribe(res => {
            const { message, data: {is_created} } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            this.isButtonLoading = false;
            this.data.button_name = "Create";
            if(is_created) {
                this.router.navigate(["/admin/user-accounts"])
                this.dialogRef.close()
            }
        })
    }

    update() {
        this.isButtonLoading = true;
        this.data.button_name = "Updating";
        const { userId, updatedUserAccounts } = this.data;
        this.userAccountServices.updateUserAccountById(userId, updatedUserAccounts).subscribe(res => {
            this.isButtonLoading = false;
            const { isUpdated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if(isUpdated) {
                this.router.navigate(["/admin/user-accounts", { updatedUserId: userId }])
                this.dialogRef.close()
            }
        })
    }
    
    activate_deactivate() {
        const { button_name, user: { id } } = this.data;
        if(button_name == "Deactivate") {
            this.data.button_name = "Deactivating";
            this.isButtonLoading = true;
            this.userAccountServices.deactivateUserAccountById(id, "Deactivate").subscribe(res => {
                this.isButtonLoading = false;
                const { isDeactivated, message } = res;
                if(isDeactivated) {
                    this.snackBar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({
                        id,
                        is_active: false
                    })
                }
               
            })
        }

        if(button_name == "Activate") {
            this.data.button_name = "Activating";
            this.isButtonLoading = true;
            this.userAccountServices.deactivateUserAccountById(id, "Activate").subscribe(res => {
                this.isButtonLoading = false;
                const { isActivated, message } = res;
                if(isActivated) {
                    this.snackBar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({
                        id,
                        is_active: true
                    })
                }
               
            })
        }
    }

    resetPassword() {
        const { user: { id } } = this.data;
        this.isButtonLoading = true;
        this.data.button_name = "Password Resetting";
        // setTimeout(() => {
        //     this.isButtonLoading = false;
        //     this.dialogRef.close({
        //         id,
        //         isReset: true
        //     })
        // }, 2000);
        this.userAccountServices.resetPassword(id).subscribe(res => {
            this.isButtonLoading = false;
            const { message, isReset } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if(isReset) {
                this.dialogRef.close({
                    id,
                    isReset: true
                })
            }
        })
    }

}