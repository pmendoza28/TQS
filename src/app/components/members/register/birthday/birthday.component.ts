import { Component } from "@angular/core";
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

    next() {
        this.membersRegisterServices.steps = "Address";
    }

    back() {
        this.membersRegisterServices.steps = "Gender"
    }
}