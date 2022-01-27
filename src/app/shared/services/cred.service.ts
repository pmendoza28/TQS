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
    // port: string = "http://8f4d-110-54-129-24.ngrok.io/api"

    getCredentials(): {token: string, user: any} {
        return {
            token: this.localService.getJsonValue("token"),
            user: this.localService.getJsonValue("user"),
        }
        
    }
}