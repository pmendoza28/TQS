import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExcelViewerComponent } from "./excel-viewer/excel.viewer.component";

const routes: Routes = [
    { path: 'excel-viewer', component: ExcelViewerComponent }
]

@NgModule({
    declarations: [
        ExcelViewerComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class SandboxModule {

}