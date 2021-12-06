import { Injectable } from "@angular/core";
import { LocalService } from "./local.service";

@Injectable({
    providedIn: "root"
})

export class CredServices {
    constructor(
        private localService: LocalService
    ) {}
    port: string = "http://10.10.8.22:8000/api";

    getCredentials(): {token: string, access: any, user: any} {
        return {
            token: this.localService.getJsonValue("token"),
            access: this.localService.getJsonValue("access"),
            user: this.localService.getJsonValue("user"),
        }
        
    }
}