import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { ReportsComponent } from "./reports.component";

const routes: Routes = [
    { path: '', component: ReportsComponent }
]

@NgModule({
    declarations: [
        ReportsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        CommonModule,
    ]
})

export class ReportsModule {

}