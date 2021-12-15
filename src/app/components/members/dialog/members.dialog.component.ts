import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MembersServices } from "../members.service";

@Component({
    selector: 'app-members-dialog',
    templateUrl: './members.dialog.component.html',
    styleUrls: ['./members.dialog.component.scss']
})

export class MembersDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<MembersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private membersServices: MembersServices,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    isButtonLoading: boolean = false;
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log(this.data)
    }

    create() {
        this.isButtonLoading = true;
        this.data.button_name = "Creating";
        const { memberForm } = this.data;
        this.membersServices.createMember(memberForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Create";
            console.log(res)
            const { isCreated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if(isCreated) {
                this.dialogRef.close();
                this.router.navigate(["/admin/members"])
            }    
        })
    }
    
    update() {
        this.isButtonLoading = true;
        this.data.button_name = "Updating";
        const { memberId, memberForm } = this.data;
        this.membersServices.updateMemberbyId(memberId, memberForm).subscribe(res => {
            console.log(res)
            const { isUpdated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if(isUpdated) {
                this.dialogRef.close()
                this.router.navigate(["/admin/members"])
            }
        })
    }

    ActivateInActive() {
        this.isButtonLoading = true;
        if(this.data.button_name == "Deactivate") {
            this.data.button_name = "Deactivating";
            const { memberId } = this.data;
            if(this.data.button_name == "Deactivating") {
                this.membersServices.updateStatusById(memberId, false).subscribe(res => {
                    this.data.button_name = "Deactivate";
                    const { isDeactivated, message } = res;
                    this.snackBar.open(message, "", { duration: 3000 })
                    if(isDeactivated) {
                        this.dialogRef.close({
                            memberId,
                            status: "Inactive",
                        })
                    }
                })
            }
        }
        if(this.data.button_name == "Activate") {
            this.data.button_name = "Activating";
            const { memberId } = this.data;
            this.membersServices.updateStatusById(memberId, true).subscribe(res => {
                this.data.button_name = "Activate";
                const { isActivated, message } = res;
                this.snackBar.open(message, "", { duration: 3000 })
                if(isActivated) {
                    this.dialogRef.close({
                        memberId,
                        status: "Active",
                    })
                }
            })
        }
    }

    discard() {
        this.router.navigate(["/admin/members"])
        this.dialogRef.close()
    }
}