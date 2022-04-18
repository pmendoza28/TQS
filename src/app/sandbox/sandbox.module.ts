import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ExcelViewerComponent } from "./excel-viewer/excel.viewer.component";
import { ExcelWithPasswordComponent } from "./excel-with-password/excel-with-password.component";
import { JsonDbComponent } from "./json-db/json.db.component";
import { TreeComponent } from "./tree/tree.component";
import {MatTreeModule} from '@angular/material/tree';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { HttpComponent } from "./http/http.component";
import { MatRippleModule } from "@angular/material/core";
const routes: Routes = [
    { path: 'excel-viewer', component: ExcelViewerComponent },
    { path: 'excel-viewer-with-password', component: ExcelWithPasswordComponent },
    { path: 'json-db', component: JsonDbComponent },
    { path: 'tree', component: TreeComponent },
    { path: 'http', component: HttpComponent },

]

@NgModule({
    declarations: [
        ExcelViewerComponent,
        ExcelWithPasswordComponent,
        TreeComponent,
        HttpComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgxMatFileInputModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule
    ]
})

export class SandboxModule {

}