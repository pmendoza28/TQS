import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from "../shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class LoginGuard implements CanActivate {

    constructor(
        private credServices: CredServices
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let { token, user } = this.credServices.getCredentials();
        if(!token) {
            return true
        }
        else {
            return false
        }
    }

}