import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-gender',
    templateUrl: './gender.component.html',
    styleUrls: ['./gender.component.scss']
})

export class GenderComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}
    
    next() {
        this.membersRegisterServices.steps = "Birthday"
    }

    back() {
        this.membersRegisterServices.steps = "Name"
    }

    validateFields() {
        if(this.membersRegisterServices.gender == '') {
            return true
        }
        return false;
    }
    
}