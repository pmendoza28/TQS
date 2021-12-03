import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/shared/services/local.service';
import { AdminLoginServices } from './admin-login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  constructor(
    private fb: FormBuilder,
    private adminLoginServices: AdminLoginServices,
    private snackBar: MatSnackBar,
    private router: Router,
    private localService: LocalService
  ) { }

  loginForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  })

  isAuthenticating: boolean = false;
  btnLogin: "Login" | "Authenticating" = "Login";

  authenticate() {
    this.isAuthenticating = true;
    this.btnLogin = "Authenticating";
    this.adminLoginServices.authenticate(this.loginForm.value).subscribe(res => {
      /*****************@SET_STATE_VALUES ******************** */
      this.isAuthenticating = false;
      this.btnLogin = "Login";
      
      const { isAuthenticated, message, data } = res;
      this.snackBar.open(message, "", { duration: 3000 })

      if (isAuthenticated) {
        const { access, token, user } = data;
        this.localService.setJsonValue("token", token);
        this.localService.setJsonValue("user", user);
        this.localService.setJsonValue("access", access);
        this.router.navigate(["/admin/user-accounts"])
      }
    })
  }
  
}
