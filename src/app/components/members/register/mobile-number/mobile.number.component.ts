import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-mobile-number',
    templateUrl: './mobile.number.component.html',
    styleUrls: ['./mobile.number.component.scss']
})

export class MobileNumberComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices,
        private snackBar: MatSnackBar
    ) {}

    isValidating: boolean = false;

    fieldValidation() {
        let mobileNumber = this.membersRegisterServices.mobile_number.toString()
        if(mobileNumber.length != 11 || this.isValidating) {
            return true;
        }
        return false;
    }

    validateButton() {
        if(this.membersRegisterServices.isMobileNumberExists == true || this.membersRegisterServices.validatedMobileNumber != this.membersRegisterServices.mobile_number) {
            return true
        }
        return false
    }

    validateNextButton() {
        if(this.membersRegisterServices.isMobileNumberExists == false && this.membersRegisterServices.validatedMobileNumber == this.membersRegisterServices.mobile_number) {
            return true
        }
        return false;
    }

    addNumber(value: string) {
        this.membersRegisterServices.mobile_number += value;
    }

    remove() {
        this.membersRegisterServices.mobile_number = this.membersRegisterServices.mobile_number.slice(0, -1)
    }

    next() {
        this.membersRegisterServices.steps = "Name";
    }

    validate() {
        if(this.fieldValidation()) {
            this.snackBar.open("Mobile Number must be at least 11 digits", "", {
                duration: 3000
            })
        }
        else {
            this.isValidating = true;
            this.membersRegisterServices.validateMobileNumber().subscribe(res => {
                console.log(res)
                const { mobileNumber } = res;
                this.membersRegisterServices.validatedMobileNumber = mobileNumber;
                this.isValidating = false;
                this.membersRegisterServices.isMobileNumberExists = false;
                this.membersRegisterServices.can_access_layer = "Name"
            }, err => {
                const { statusText } = err;
                this.isValidating = false;
                this.membersRegisterServices.isMobileNumberExists = true;
                this.snackBar.open("Mobile Number is already exists", "", {
                    duration: 3000
                })
            })
        }
        
    }
}