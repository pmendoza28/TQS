import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class EarnedPointsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    getEarnedPointsWithPaginator(currentPage: number, pointsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/earnedpoints/${pointsPerPage}/?page=${currentPage}`).pipe(
            timeout(10000)
        )
    }

    searchEarnedPoints(searchvalue: string, currentPage: number, earnedPointsPerPage: number): Observable<any> {
        return this.http.get(``)
    }
}