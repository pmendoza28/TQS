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

    updatedUserAccounts: {
        id: number;
        changed?: {
            first_name?: boolean;
            last_name?: boolean;
            username?: boolean;
            is_active?: boolean;
        }
    }[] = [
            { id: 31, changed: { is_active: true } }
        ]

    getUserAccountsWithPaginator(currentPage: number, userAccountsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/accounts/${userAccountsPerPage}/?page=${currentPage}`).pipe(
            timeout(10000)
        )
    }

    searchUserAccount(searchvalue: string, currentPage: number, userAccountPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/accounts/search/${userAccountPerPage}?page=${currentPage}`, { searchvalue })
    }

    createUserAccount(userAccountObject: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/accounts/create`, userAccountObject)
    }
    
    getUserAccountById(userId: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/accounts/getuserbyid/${userId}`)
    }

    updateUserAccountById(userId: number, updatedUserAccount: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/accounts/update-account/${userId}`, updatedUserAccount)
    }

    deactivateUserAccountById(userId: number, action: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/accounts/update-account-status/${userId}`, { action })
    }

    resetPassword(userId: number): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/accounts/reset-password/${userId}`, {})
    }
}