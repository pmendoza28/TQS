import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { UserAccountsDialogComponent } from "../dialog/user-accounts.dialog.component";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-edit',
    templateUrl: './user.accounts.edit.component.html',
    styleUrls: ['./user.accounts.edit.component.scss']
})

export class UserAccountEditComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userAccountServices: UserAccountsServices,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) { }

    title: string = "User-Account Edit";
    userIdParams: number = this.route.snapshot.params["userId"]
    roleQuery: "admin" | "cashier";
    
    userAccountForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        username: ["", Validators.required],
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

    ngOnInit(): void {
        this.populateUserAccountByUserId()
        this.checkFormValueChanges()
        
    }
    isGettingUserAccountById: boolean = false;
    userAccountClone: any;
    populateUserAccountByUserId() {
        this.isGettingUserAccountById = true;
        this.userAccountServices.getUserAccountById(this.userIdParams).subscribe(res => {
            this.isGettingUserAccountById = false;
            const { isUserExist, data: { user } } = res;
            this.userAccountClone = user;
            this.roleQuery = user.role
            
            const access_permission = user.access_permission.split(", ");
            if (isUserExist) {
                this.userAccountForm.patchValue({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    role: user.role,
                })
                access_permission.map((access: string) => {
                    this.populatePermissionValue(access);
                })
                this.convertAccessPermission()

            }
        })
    }


    populatePermissionValue(access: string) {
        switch (access) {
            case "user-accounts":
                this.userAccountForm.patchValue({
                    access_permission: {
                        user_accounts: true
                    }
                })
                break;
            case "stores":
                this.userAccountForm.patchValue({
                    access_permission: {
                        stores: true
                    }
                })
                break;
            case "members":
                this.userAccountForm.patchValue({
                    access_permission: {
                        members: true
                    }
                })
                break;

            case "earned-redeemed":
                this.userAccountForm.patchValue({
                    access_permission: {
                        earned_redeemed: true
                    }
                })
                break;

            case "transactions":
                this.userAccountForm.patchValue({
                    access_permission: {
                        transactions: true
                    }
                })
                break;

            case "generate-file":
                this.userAccountForm.patchValue({
                    access_permission: {
                        generate_file: true
                    }
                })
                break;
        }
    }
    btnAction: "Nothing to update" |"Update" = "Nothing to update";
    checkFormValueChanges() {
        this.userAccountForm.valueChanges.subscribe(() => {
            this.ifSomethingToChangeValue()
        })
    }

    ifSomethingToChangeValue() {
        this.convertAccessPermission()
        if(this.userAccountClone["first_name"] != this.userAccountForm.value["first_name"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.userAccountClone["last_name"] != this.userAccountForm.value["last_name"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.userAccountClone["username"] != this.userAccountForm.value["username"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.userAccountClone["role"] != this.userAccountForm.value["role"]) {
            this.btnAction = "Update";
            return true
        }

        if(JSON.stringify(this.userAccountClone["access_permission"].split(", ")) != JSON.stringify(this.permissions.toString().split(","))) {
            this.btnAction = "Update";
            return true
        }
        else {
            this.btnAction = "Nothing to update";
            return false
        }

    }

    update() {
        this.convertAccessPermission()
        const { first_name, last_name, username, role } = this.userAccountForm.value;
        let updatedUserAccounts = {
            first_name,
            last_name, 
            username, 
            role,
            access_permission: this.permissions
        }
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to update this user account?",
                action: "updateUserAccount",
                button_name: "Update",
                updatedUserAccounts,
                userId: this.userIdParams
            }
        })
        
    }

    permissions: string[] = [];
    convertAccessPermission() {
        this.permissions = [];
        let { access_permission: { user_accounts, stores, members, earned_redeemed, transactions, generate_file, earning, redeeming } } = this.userAccountForm.value
        if (user_accounts) {
            this.permissions.push("user-accounts")
        }
        if (stores) {
            this.permissions.push("stores")
        }
        if (members) {
            this.permissions.push("members")
        }
        if (earned_redeemed) {
            this.permissions.push("earned-redeemed")
        }
        if (earning) {
            this.permissions.push("earning")
        }
        if (redeeming) {
            this.permissions.push("redeeming")
        }
        if (transactions) {
            this.permissions.push("transactions")
        }
        if (generate_file) {
            this.permissions.push("generate-file")
        }
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
        if(this.getRole() == this.roleQuery) {
            this.userAccountServices.getUserAccountById(this.userIdParams).subscribe(res => {
                const { data: { user } } = res;
                const access_permission = user.access_permission.split(", ");
                access_permission.map((access: string) => {
                    this.populatePermissionValue(access);
                })
                this.convertAccessPermission()
            })
        }
    }

    getRole() {
        let { role } = this.userAccountForm.value;
        return role;
    }

    formValidation() {
        if (!this.userAccountForm.valid || this.permissions.length == 0) {
            return true
        }
        else { return false }
    }

    inputControl(property: string) {
        return this.userAccountForm.controls[property]
    }
    
    back() {
        if(this.ifSomethingToChangeValue()) {
            this.dialog.open(UserAccountsDialogComponent, {
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
            this.router.navigate(["/admin/user-accounts"])
        }
       
    }
}