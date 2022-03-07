import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { MembersDialogComponent } from "../../dialog/members.dialog.component";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})

export class OverviewComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private credServices: CredServices,
        private router: Router
    ) {} 
   
    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }

    back() {
        this.membersRegisterServices.steps = "Cooking";
    }

    createMember() {
        const memberForm = {
            first_name: this.membersRegisterServices.first_name,
            last_name: this.membersRegisterServices.last_name,
            gender: this.membersRegisterServices.gender,
            birthday: this.membersRegisterServices.birthday,
            email: this.membersRegisterServices.email,
            barangay: this.membersRegisterServices.barangay,
            municipality: this.membersRegisterServices.municipality,
            province: this.membersRegisterServices.province,
            mobile_number: this.membersRegisterServices.mobile_number,
        }
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                memberForm,
                title: "Confirmation",
                question: "Are you sure you want to create this member?",
                button_name: "Create",
                action: 'createMemberInStore'
            }
        }).afterClosed().subscribe(dialogResponse => {
            if(dialogResponse.error) {
                this.snackBar.open(dialogResponse.error.message, "", {
                    duration: 3000
                })
            }
            
            if(dialogResponse.isCreated) {
                this.snackBar.open(dialogResponse.res.message, "", {
                    duration: 3000
                })
                this.membersRegisterServices.buttonName = "CREATED";
                this.router.navigate(['/client/transactions'])
            }

            // else {
            //     if(isCreated) {
            //         this.snackBar.open(message, "", {
            //             duration: 3000
            //         })
            //         this.membersRegisterServices.buttonName = "CREATED";
            //     }
            // }
          
        })
        
    }

}