import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { StoresDialogComponent } from "../dialog/stores.dialog.component";
import { StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-edit',
    templateUrl: './stores.edit.component.html',
    styleUrls: ['./stores.edit.component.scss']
})

export class StoresEditComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private storesServices: StoresServices,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private snackbar: MatSnackBar
    ) {}

    /** @LifeCycles ========================================================= */
    ngOnInit(): void {
        this.populateRegions()
        this.getStoreById()
    }

    /** @States ========================================================= */
    title: string = "Store Edit";
    regions: string[] = [];
    storeIdParams: number = this.route.snapshot.params["storeId"]
    storeForm: FormGroup = this.fb.group({
        code: ["", Validators.required],
        name: ["", Validators.required],
        area: ["", Validators.required],
        region: ["", Validators.required],
        cluster: ["", Validators.required],
        business_model: ["", Validators.required],
        token: [""]
    })
    isGettingStoreById: boolean = false;
    storeClone: any;
    btnAction: "Nothing to update" |"Update" = "Nothing to update";
    isGenerateTokenLoading: boolean;

    /** @Methods ========================================================= */
    populateRegions() {
        this.storesServices.getAllRegions().subscribe(res => {
            this.regions = res;
        })
    }

    getToken() {
        let {token} = this.storeForm.value;
        return token;
    }

    copyToken(){
        this.snackbar.open("Token Copied to clipboard", "", { duration: 3000 });
    }

    getStoreById() {
        this.isGettingStoreById = true;
        this.storesServices.getStoreById(this.storeIdParams).subscribe(res => {
            this.isGettingStoreById = false;
            const { data: { store: { code, name, area, region, cluster, business_model, token } }, isStoreExist } = res;
            this.storeClone = { code, name, area, region, cluster, business_model, token };
            
            if(isStoreExist) {
                this.storeForm.patchValue({
                    code,
                    name,
                    area,
                    region,
                    cluster,
                    business_model,
                    token
                })
            }
        })
    }
    
    formValidation() {
        if(!this.storeForm.valid) {
            return true
        }
        else {
            return false
        }
    }

    checkFormValueChanges() {
        this.storeForm.valueChanges.subscribe(() => {
            this.ifSomethingToChangeValue()
        })
    }

    ifSomethingToChangeValue() {
        if(this.storeClone["code"] != this.storeForm.value["code"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.storeClone["name"] != this.storeForm.value["name"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.storeClone["area"] != this.storeForm.value["area"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.storeClone["region"] != this.storeForm.value["region"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.storeClone["cluster"] != this.storeForm.value["cluster"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.storeClone["business_model"] != this.storeForm.value["business_model"]) {
            this.btnAction = "Update";
            return true
        }

        if(this.storeClone["token"] != this.storeForm.value["token"]) {
            this.btnAction = "Update";
            return true
        }

        else {
            this.btnAction = "Nothing to update";
            return false
        }
    }

    update() {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to update this store?",
                action: "updateStore",
                button_name: "Update",
                storeId: this.storeIdParams,
                storeForm: this.storeForm.value
            }
        })
    }
    
    generateToken() {
        this.isGenerateTokenLoading = true;
        this.storesServices.reGenerateToken().subscribe(res => {
            this.isGenerateTokenLoading = false;
            const { data: { newtoken } } = res;
            this.storeForm.patchValue({token: newtoken})
        })
    }

    back() {
        if(this.ifSomethingToChangeValue()) {
            this.dialog.open(StoresDialogComponent, {
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
            this.router.navigate(["/admin/stores"])
        }
    }

    reset() {
        this.storeForm.controls['code'].reset()
        this.storeForm.controls['name'].reset()
        this.storeForm.controls['area'].reset()
        this.storeForm.controls['region'].reset()
        this.storeForm.controls['cluster'].reset()
        this.storeForm.controls['business_model'].reset()
    }
}