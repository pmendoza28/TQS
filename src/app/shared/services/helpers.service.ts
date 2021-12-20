import { Injectable } from "@angular/core";
@Injectable({
    providedIn: "root"
})

export class HelperServices {
    hasInternet: boolean;

    filterTable(event: Event, dataSource: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        dataSource.filter = filterValue.trim().toLowerCase();
    
        if (dataSource.paginator) {
          dataSource.paginator
        }
    }
}