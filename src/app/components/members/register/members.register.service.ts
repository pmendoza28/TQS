import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root"
})

export class MembersRegisterServices {
    constructor(
        private fb: FormBuilder
    ) { }
    steps: TSteps = "Cooking"
    mobile_number: string = ''; 
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    birthday: string;
    province: string;
    municipality: string;
    barangay: string;
    working: string;
    cooking: string;
    
}

export type TSteps = "Mobile Number" | "Name" | "Gender" | "Birthday" | "Address" | "Working" | "Cooking" | "Overview";