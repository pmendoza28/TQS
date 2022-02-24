import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-mobile-number',
    templateUrl: './mobile.number.component.html',
    styleUrls: ['./mobile.number.component.scss']
})

export class MobileNumberComponent {
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
        this.membersRegisterServices.steps = "Name";
    }
}