import { Component, ElementRef, ViewChild } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class AddressComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    @ViewChild("txtProvince") txtProvince: ElementRef

    ngAfterViewInit(): void {
        this.focusProvince()
    }

    focusProvince() {
        setTimeout(() => {
            this.txtProvince.nativeElement.focus()
        }, 0);
    }

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.ctrlKey && e.key == "ArrowLeft") {
            this.back()
        }
        if(e.ctrlKey && e.key == "ArrowRight") {
            this.next()
        }
        if(e.key == "Enter") {
            this.next()
        }
    }

    back() {
        this.membersRegisterServices.steps = "Birthday";
    }

    next() {
        if(!this.validateFields()) {
            this.membersRegisterServices.steps = "Email";
        }

    }

    validateFields() {
        if(this.membersRegisterServices.province.trim() == '' || this.membersRegisterServices.municipality.trim() == '' || this.membersRegisterServices.barangay.trim() == '') {
            return true
        }
        return false;
    }
}