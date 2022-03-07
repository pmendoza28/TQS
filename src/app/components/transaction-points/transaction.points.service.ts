import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class TransactionPointsService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    getEarnedPoints(): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/earn`)
    }
}