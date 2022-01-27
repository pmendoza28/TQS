import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-dialog',
    templateUrl: './stores.dialog.component.html',
    styleUrls: ['./stores.dialog.component.scss']
})

export class StoresDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<StoresDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storesServices: StoresServices,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    /** @States ====================================================== */
    isButtonLoading: boolean = false;

    /** @Methods ===================================================== */
    create() {
        const { storeForm } = this.data;
        this.isButtonLoading = true;
        this.data.button_name = "Creating"
        console.log(storeForm);
        this.storesServices.createStore(storeForm).subscribe(res => {
            this.isButtonLoading = false;
            const { isCreated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            this.data.button_name = "Create";
            if(isCreated) {
                this.router.navigate(["/admin/stores"])
                this.dialogRef.close()
            }
        })
    }

    update() {
        this.isButtonLoading = true;
        const { storeId, storeForm } = this.data;
        this.data.button_name = "Updating...";
        this.storesServices.updateStoreById(storeId, storeForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Update";
            const { isUpdated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if(isUpdated) {
                this.router.navigate(["/admin/stores"])
                this.dialogRef.close()
            }
        })
    }

    ActivateInActive() {
        this.isButtonLoading = true;
        if(this.data.button_name == "Deactivate") {
            this.data.button_name = "Deactivating";
            const { store: { id } } = this.data;
            if(this.data.button_name == "Deactivating") {
                this.storesServices.updateStoreStatus(id, false).subscribe(res => {
                    this.data.button_name = "Deactivate";
                    const { isDeactivated, message } = res;
                    this.snackBar.open(message, "", { duration: 3000 })
                    if(isDeactivated) {
                        this.dialogRef.close({
                            storeId : id,
                            status: "Inactive",
                        })
                    }
                })
            }
        }
        if(this.data.button_name == "Activate") {
            this.data.button_name = "Activating";
            const { store: { id } } = this.data;
            this.storesServices.updateStoreStatus(id, true).subscribe(res => {
                this.data.button_name = "Activate";
                const { isActivated, message } = res;
                this.snackBar.open(message, "", { duration: 3000 })
                if(isActivated) {
                    this.dialogRef.close({
                        storeId: id,
                        status: "Active",
                    })
                }
            })
        }
    }

    discard() {
        this.router.navigate(["/admin/stores"])
        this.dialogRef.close()
    }

}