import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ExcelViewerComponent } from "./excel-viewer/excel.viewer.component";
import { ExcelWithPasswordComponent } from "./excel-with-password/excel-with-password.component";
import { JsonDbComponent } from "./json-db/json.db.component";

const routes: Routes = [
    { path: 'excel-viewer', component: ExcelViewerComponent },
    { path: 'excel-viewer-with-password', component: ExcelWithPasswordComponent },
    { path: 'json-db', component: JsonDbComponent },

]

@NgModule({
    declarations: [
        ExcelViewerComponent,
        ExcelWithPasswordComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgxMatFileInputModule,
    ]
})

export class SandboxModule {

}