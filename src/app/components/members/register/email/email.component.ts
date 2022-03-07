import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})

export class EmailComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    next() {
        this.membersRegisterServices.steps = "Working";
    }

    back() {
        this.membersRegisterServices.steps = "Address"
    }

    validateFields() {
        if(this.membersRegisterServices.email.trim() == '') {
            return true
        }
        return false;
    }
}