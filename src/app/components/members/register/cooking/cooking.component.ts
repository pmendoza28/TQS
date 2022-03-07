import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-cooking',
    templateUrl: './cooking.component.html',
    styleUrls: ['./cooking.component.scss']
})

export class CookingComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    next() {
        this.membersRegisterServices.steps = "Overview"
    }

    back() {
        this.membersRegisterServices.steps = "Working"
    }

    validateFields() {
        if(this.membersRegisterServices.cooking == '') {
            return true
        }
        return false
    }
}