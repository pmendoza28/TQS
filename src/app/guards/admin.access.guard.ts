import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from "../shared/services/cred.service";
import { LocalService } from "../shared/services/local.service";

@Injectable({
    providedIn: "root"
})

export class AdminAccessGuard implements CanActivate {
    constructor(
        private credServices: CredServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const { user: { access_permission } } = this.credServices.getCredentials();
        const { url } = state
        const routeModule = url.split("/")[2];
        
        let hasAccess = access_permission.some((access: string) => access == routeModule)
        if(!hasAccess) {
            this.router.navigate(["/admin/unauthorized"])
        }
        
        return true;
    }

}