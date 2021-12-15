import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class MembersServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getMembersWithPaginator(currentPage: number, memberPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/members/${memberPerPage}/?page=${currentPage}`)
    }

    searchMember(searchvalue: string, currentPage: number, memberPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/search-member/${memberPerPage}/?page=${currentPage}`, { searchvalue })
    }
}