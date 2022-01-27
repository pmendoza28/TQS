import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class JsonDbServices {
    constructor(
        private http: HttpClient
    ) {}

    getUserAccounts(): Observable<any> {
        return this.http.get('../../../assets/db/user-account.json')
    }
}