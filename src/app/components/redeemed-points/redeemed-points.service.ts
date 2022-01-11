import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: `root`
})

export class RedeemedPointsServices {
    constructor(
        private http: HttpClient
    ) {}

    populateDummyRedeemedPoints(): Observable<any> {
        return this.http.get("../../../assets/json/redeemed-points.json")
    }
}