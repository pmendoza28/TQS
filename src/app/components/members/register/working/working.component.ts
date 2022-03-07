import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-working',
    templateUrl: './working.component.html',
    styleUrls: ['./working.component.scss']
})

export class WorkingComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    next() {
        this.membersRegisterServices.steps = "Cooking"
    }

    back() {
        this.membersRegisterServices.steps = "Email"
    }

    validateFields() {
        if(this.membersRegisterServices.working == '') {
            return true;
        }
        return false;
    }
}