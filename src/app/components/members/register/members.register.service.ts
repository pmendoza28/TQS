import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class MembersRegisterServices {
    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private credServices: CredServices
    ) { }
    steps: TSteps = "Mobile Number"
    mobile_number: string = ''; 
    first_name: string = '';
    last_name: string = '';
    gender: "Male" | "Female" | '' = '';
    birthday: string = '';
    email: string = '';
    province: string = '';
    municipality: string = '';
    barangay: string = '';
    purok: string = '';
    street_name: '';
    working: string = '';
    cooking: string = '';

    isMobileNumberExists: boolean = true;
    validatedMobileNumber: any = '';
    buttonName: "CREATE" | "CREATED" = "CREATE";

    can_access_layer: TSteps = "Mobile Number";
    validateMobileNumber(): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/members/validate-mobile-number`, { mobile_number: this.mobile_number })
    }

    createMember(memberForm: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/members/create-member-in-store`, memberForm)
    }
    
}

export type TSteps = "Mobile Number" | "Name" | "Gender" | "Birthday" | "Address" | "Email" | "Working" | "Cooking" | "Overview";