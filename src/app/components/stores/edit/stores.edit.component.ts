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

    ngOnInit(): void {
        this.populateRegions()
        this.getStoreById()
    }

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
        this.storesServices.getStoreById(this.storeIdParams).subscribe(res => {
            console.log(res)
            const { data: { store: { code, name, area, region, cluster, business_model, token } }, isStoreExist } = res;
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

    back() {
        this.router.navigate(["/admin/stores"])
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