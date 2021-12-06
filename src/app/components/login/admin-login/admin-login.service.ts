import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";
import { retry, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
})

export class AdminLoginServices {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    authenticate(loginForm: {username: string, password: string}) {
        return this.http.post<any>(`${this.credServices.port}/login`, loginForm).pipe(
            timeout(10000),
        )
    }
}

export interface IAuthenticateResponse {
    data?: {
        access: string;
        token: string;
        user: any;
    };
    isAuthenticated: boolean;
    message: string;
}