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

    searchStore(searchvalue: string, currentPage: number, storePerPage: number):Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/store/search/${storePerPage}/?page=${currentPage}`, { searchvalue })
    }

    getAllRegions(): Observable<any> {
        return this.http.get("../../../assets/json/regions.json")
    }

    createStore(storeForm: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/create-store`, storeForm)
    }

    getStoreById(storeId: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/store/getstorebyid/${storeId}`)
    }
    
    updateStoreById(storeId: number, storeForm: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/update-store/${storeId}`, storeForm)
    }

    updateStoreStatus(userId: number, is_active: boolean): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/update-store-status/${userId}`, { is_active })
    }

    reGenerateToken(): Observable<any>{
        return this.http.get(`${this.credServices.port}/admin/store/regenerate-token`)
    }
    


}