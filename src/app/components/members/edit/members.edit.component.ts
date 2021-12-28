import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { MembersDialogComponent } from "../dialog/members.dialog.component";
import { MembersServices } from "../members.service";

@Component({
    selector: 'app-members-edit',
    templateUrl: './members.edit.component.html',
    styleUrls: ['./members.edit.component.scss']
})

export class MembersEditComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private membersServices: MembersServices,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) {}

    title: string = "Members Edit";
    memberIdParams: number = this.route.snapshot.params["memberId"];
    isGettingStoreById: boolean = false;
    memberClone: any;
    btnAction: "Nothing to update" | "Update" = "Nothing to update";
    memberForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        gender: ["", Validators.required],
        birthday: ["", Validators.required],
        barangay: ["", Validators.required],
        municipality: ["", Validators.required],
        province: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        mobile_number: ["", [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    })

    ngOnInit(): void {
        this.populateMemberById()
        this.checkFormValueChanges()
    }

    populateMemberById() {
        this.isGettingStoreById = true;
        this.membersServices.getMemberbyID(this.memberIdParams).subscribe(res => {
            this.isGettingStoreById = false;
            const { isMemberExist, data: { member } } = res;
            const { first_name, last_name, gender, birthday, barangay, municipality, province, email, mobile_number } = member;
            if(isMemberExist) {
                this.memberClone = { 
                    first_name, 
                    last_name, 
                    gender, 
                    birthday, 
                    barangay, 
                    municipality, 
                    province, 
                    email, 
                    mobile_number: mobile_number
                };
                this.memberForm.patchValue({
                    first_name, 
                    last_name, 
                    gender, 
                    birthday, 
                    barangay, 
                    municipality, 
                    province, 
                    email, 
                    mobile_number: mobile_number
                })
            }
        })
    }

    update() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to update this member?",
                action: "updateMember",
                button_name: "Update",
                memberForm: {
                    ...this.memberForm.value, 
                    mobile_number: this.memberForm.value.mobile_number,
                    birthday: moment(this.memberForm.value.birthday).format("yyyy-MM-DD")
                },
                memberId: this.memberIdParams
            }
        })
    }

    checkFormValueChanges() {
        this.memberForm.valueChanges.subscribe(() => {
            this.ifSomethingToChangeValue()
        })
    }

    ifSomethingToChangeValue() {
        if(JSON.stringify(this.memberClone) != JSON.stringify(this.memberForm.value)) {
            this.btnAction = "Update"
            return true
        }
        else {
           this.btnAction = "Nothing to update";
            return false;
        }
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

    back() {
        if(this.ifSomethingToChangeValue()) {
            this.dialog.open(MembersDialogComponent, {
                disableClose: true,
                data: {
                    title: "Confirmation",
                    question: "Discard changes?",
                    action: "discardChanges",
                    button_name: "Discard"
                }
            })
        }
        else {
            this.router.navigate(["/admin/members"])
        }
    }
    
}