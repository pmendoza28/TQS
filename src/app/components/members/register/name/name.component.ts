import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-name',
    templateUrl: './name.component.html',
    styleUrls: ['./name.component.scss']
})

export class NameComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}
    addNumber(value: string) {
        this.membersRegisterServices.mobile_number += value;
    }

    remove() {
        this.membersRegisterServices.mobile_number = this.membersRegisterServices.mobile_number.slice(0, -1)
    }

    next() {
        this.membersRegisterServices.steps = "Gender";
    }

    back() {
        this.membersRegisterServices.steps = "Mobile Number";
    }

    validateFields() {
        if(this.membersRegisterServices.first_name.trim() == '' || this.membersRegisterServices.last_name.trim() == '') {
            return true
        }
        return false;
    }
}