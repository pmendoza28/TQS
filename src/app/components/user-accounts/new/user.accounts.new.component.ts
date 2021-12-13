import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UserAccountsDialogComponent } from "../dialog/user-accounts.dialog.component";

@Component({
    selector: 'app-user-accounts-new',
    templateUrl: './user.accounts.new.component.html',
    styleUrls: ['./user.accounts.new.component.scss']
})

export class UserAccountsNewComponent {
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) {}
    title: string = "User-Account New"
    adminPermissions = ["user-accounts", "members", "stores", "earned_redeemed", "transactions", "generate_file"]
    cashierPermissions = [""]
    userAccountForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        username: ["", Validators.required],
        password: ["", Validators.required],
        role: ["", Validators.required],
        access_permission: this.fb.group({
            user_accounts: [],
            stores: [],
            members: [],
            earned_redeemed: [],
            transactions: [],
            generate_file: [],
            earning: [],
            redeeming: [],
        }),
    })

    permissions: string[] = []

    addPermission(permission: string) {
        this.permissions.push(permission)
    }

    convertAccessPermission() {
        this.permissions = [];
        let {access_permission: {user_accounts, stores, members, earned_redeemed, transactions, generate_file, earning, redeeming}} = this.userAccountForm.value
        if(user_accounts) {
            this.permissions.push("user-accounts")
        }
        if(stores) {
            this.permissions.push("stores")
        }
        if(members) {
            this.permissions.push("members")
        }
        if(earned_redeemed) {
            this.permissions.push("earned-redeemed")
        }
        if(earning) {
            this.permissions.push("earning")
        }
        if(redeeming) {
            this.permissions.push("redeeming")
        }
        if(transactions) {
            this.permissions.push("transactions")
        }
        if(generate_file) {
            this.permissions.push("generate-file")
        }
        this.userAccountForm.value.access_permission = this.permissions
    }

    getRole() {
        let { role } = this.userAccountForm.value;
        return role;
    }

    create() {
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to create this User Account?",
                action: "createUserAccount",
                button_name: "Create",
                userAccountForm: this.userAccountForm.value
            }
        })
    }

    resetPermissions() {
        this.userAccountForm.patchValue({
            access_permission: {
                user_accounts: false,
                stores: false,
                members: false,
                earned_redeemed: false,
                transactions: false,
                generate_file: false,
                earning: false,
                redeeming: false,
            }
        })
        this.permissions = []
    }

    formValidation() {
        if(!this.userAccountForm.valid || this.permissions.length == 0) {
            return true
        }
        else { return false}
    }
    
    back() {
        this.router.navigate(["/admin/user-accounts"])
    }
}
