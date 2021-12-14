import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StoresDialogComponent } from "../dialog/stores.dialog.component";
import { StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-new',
    templateUrl: './stores.new.component.html',
    styleUrls: ['./stores.new.component.scss']
})

export class StoresNewComponent {
    constructor(
        private router: Router,
        private storesServices: StoresServices,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) {}
    title: string = "Store New";
    regions: string[] = [];
    storeForm: FormGroup = this.fb.group({
        code: ["", Validators.required],
        name: ["", Validators.required],
        area: ["", Validators.required],
        region: ["", Validators.required],
        cluster: ["", Validators.required],
        business_model: ["", Validators.required],
    })

    ngOnInit(): void {
        this.populateRegions()
    }

    populateRegions() {
        this.storesServices.getAllRegions().subscribe(res => {
            this.regions = res;
        })
    }

    create() {
        console.log(this.storeForm.value)
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to create this store?",
                action: "createStore",
                button_name: "Create",
                storeForm: this.storeForm.value
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

    back() {
        this.router.navigate(["/admin/stores"])
    }
}