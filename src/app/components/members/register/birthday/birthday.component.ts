import { Component } from "@angular/core";
import * as moment from "moment";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss']
})

export class BirthdayComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    minDate = moment().subtract(100, 'years').toDate()
    maxDate = moment().subtract(5, 'years').toDate()

    next() {
        this.membersRegisterServices.steps = "Address";
    }

    back() {
        this.membersRegisterServices.steps = "Gender"
    }

    validateFields() {
        if(this.membersRegisterServices.birthday == '') {
            return true
        }
        return false;
    }
}