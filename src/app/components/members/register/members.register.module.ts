import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatStepperModule } from "@angular/material/stepper";
import { RouterModule, Routes } from "@angular/router";
import { AddressComponent } from "./address/address.component";
import { BirthdayComponent } from "./birthday/birthday.component";
import { CookingComponent } from "./cooking/cooking.component";
import { GenderComponent } from "./gender/gender.component";
import { MembersRegisterComponent } from "./members.register.component";
import { MobileNumberComponent } from "./mobile-number/mobile.number.component";
import { NameComponent } from "./name/name.component";
import { WorkingComponent } from "./working/working.component";

const routes: Routes = [
    { path: '', component: MembersRegisterComponent }
]

@NgModule({
    declarations: [
        MembersRegisterComponent,
        MobileNumberComponent,
        NameComponent,
        GenderComponent,
        BirthdayComponent,
        AddressComponent,
        WorkingComponent,
        CookingComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule, 
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ]
})

export class MembersRegisterModule {

}