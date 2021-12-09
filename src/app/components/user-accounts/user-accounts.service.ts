import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class UserAccountsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}
    getUserAccountsWithPaginator(currentPage: number, userAccountsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/accounts/${userAccountsPerPage}/?page=${currentPage}`).pipe(
            timeout(2000)
        )
    }

    searchUserAccount(searchvalue: string): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/accounts/search`, { searchvalue })
    }
}