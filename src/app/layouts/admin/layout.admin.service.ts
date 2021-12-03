import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class LayoutAdminServices {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}
    
    checkIfLoggedIn(): Observable<any> {
        let { token, user: {id} } = this.credServices.getCredentials();
        console.log({token,id})
        return this.http.post(`${this.credServices.port}/admin/isLoggedIn`, {token, id})
    }
}