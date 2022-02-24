import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredServices } from "../shared/services/cred.service";
@Injectable({
    providedIn: "root"
})

export class ClientAccessGuard implements CanActivate {
    constructor(
        private jwtHelper: JwtHelperService,
        private credServices: CredServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let client_token = this.credServices.getCredentials().client_token;
        if(client_token && !this.jwtHelper.isTokenExpired(client_token)) {
            return true
        }
        else {
            this.router.navigate(['/login'])
            return false
        }
    }

}