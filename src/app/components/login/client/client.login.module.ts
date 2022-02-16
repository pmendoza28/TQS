import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsStoreActivated } from "src/app/guards/is.store.activated.guard";
import { ClientLoginComponent } from "./client.login.component";

const routes: Routes = [
    { path: '', canActivate: [IsStoreActivated], component: ClientLoginComponent }
];

@NgModule({
    declarations: [ClientLoginComponent],
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class ClientLoginModule {

}