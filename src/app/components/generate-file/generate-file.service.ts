import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class GenerateFileServices {

    constructor(
        private http: HttpClient
    ) {}

    generateDatabase(): Observable<any> {
        return this.http.get("../../../assets/json/updated-database.json")
    }
}