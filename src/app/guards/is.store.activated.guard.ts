import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { PortalServices } from "../components/portal/portal.service";

@Injectable({
    providedIn: "root"
})

export class IsStoreActivated implements CanActivate {
    constructor(
        private portalServices: PortalServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const { url } = state
        const routeModule = url.split("/")[2];
        this.portalServices.checkIfStoreIsActivated().subscribe(res => {
            const { isActivated } = res;
            if(!isActivated) {
                switch(routeModule) {
                    case "getting-started" :
                        this.router.navigate(['/portal/getting-started']);
                        break;
                    case "installation":
                        this.router.navigate(['/portal/installation']);
                        break;
                    default :
                        this.router.navigate(['/portal/getting-started']);
                }
                return false;
            }
            else {
                this.router.navigate(['/login'])
                return true;
            }
        })
        
        return true;
    }

}