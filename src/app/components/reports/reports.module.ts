import { NgModule } from "@angular/core";
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
        AdminContainerModule
    ]
})

export class ReportsModule {

}