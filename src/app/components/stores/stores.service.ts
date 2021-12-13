import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class StoresServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    getStoresWithPaginator(currentPage: number, storePerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/stores/${storePerPage}/?page=${currentPage}`)
    }

    searchStore(searchvalue: string):Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/store/search`, { searchvalue })
    }
}