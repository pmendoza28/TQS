import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})

export class AddressComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    back() {
        this.membersRegisterServices.steps = "Birthday";
    }

    next() {
        this.membersRegisterServices.steps = "Email";
    }

    validateFields() {
        if(this.membersRegisterServices.province.trim() == '' || this.membersRegisterServices.municipality.trim() == '' || this.membersRegisterServices.barangay.trim() == '') {
            return true
        }
        return false;
    }
}