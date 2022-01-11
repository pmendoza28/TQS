import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterModule, Routes } from "@angular/router";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { GenerateFileComponent } from "./generate.file.component";

const routes: Routes = [
    { path: '', component: GenerateFileComponent }
]

@NgModule({
    declarations: [
        GenerateFileComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatButtonModule,
        MatProgressBarModule,
        CommonModule
    ]
})

export class GenerateFileModule {

}