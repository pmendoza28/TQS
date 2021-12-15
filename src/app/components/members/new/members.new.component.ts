import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as moment from "moment";

import { MembersDialogComponent } from "../dialog/members.dialog.component";

@Component({
    selector: 'app-members-new',
    templateUrl: './members.new.component.html',
    styleUrls: ['./members.new.component.scss']
})

export class MembersNewComponent {

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router
    ) {}

    title: string = "Member New";
    memberForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        gender: ["", Validators.required],
        birthday: ["", Validators.required],
        barangay: ["", Validators.required],
        municipality: ["", Validators.required],
        province: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        mobile_number: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    })

    create() {
        console.log(this.memberForm.value)
        var options = {
            year: "numeric",
            weekday: "short",
            month: "2-digit",
            day: "numeric"
        };
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to create this member?",
                action: "createMember",
                button_name: "Create",
                memberForm: {
                    ...this.memberForm.value, 
                    mobile_number: `63${this.memberForm.value.mobile_number}`,
                    birthday: moment(this.memberForm.value.birthday).format("yyyy-MM-DD")
                }
            }
        })
    }

    back() {
        this.router.navigate(["/admin/members"])
    }

    formValidation() {
        if(!this.memberForm.valid) {
            return true
        }
        else {
            return false
        }
    }

    inputControl(property: string) {
        return this.memberForm.controls[property]
    }

    
}