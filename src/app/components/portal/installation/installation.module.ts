import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InstallationComponent } from "./installation.component";

const routes: Routes = [
    { path: '', component: InstallationComponent }
]

@NgModule({
    declarations: [
        InstallationComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class InstallationModule {

}