import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LocalService } from "src/app/shared/services/local.service";
import { ClientLoginServices } from "./client.login.service";

@Component({
    selector: 'app-client-login',
    templateUrl: './client.login.component.html',
    styleUrls: ['./client.login.component.scss']
})

export class ClientLoginComponent {
    constructor(
        private clientLoginServices: ClientLoginServices,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private localService: LocalService,
        private router: Router
    ) {}

    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    })

    login() {
        this.clientLoginServices.login(this.loginForm.value).subscribe(res => {
            console.log(res)
            const { token, user, storeActivated } = res;
            this.localService.setJsonValue("client-user", user)
            this.localService.setJsonValue("client-token", token)
            this.localService.setJsonValue("store-activated", storeActivated)
            this.router.navigate(['/client/transactions']).then(() => location.reload())
        }, err => {
            console.log(err)
            const { error: { message } } = err;
            this.snackBar.open(message, "", {
                duration: 3000
            })
        })
    }
}