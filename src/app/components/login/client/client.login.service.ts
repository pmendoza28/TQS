import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ClientLoginServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    login(credentials: ILoginBodyParams): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/auth`, credentials )
    }
}


interface ILoginBodyParams {
    username: string;
    password: string
}