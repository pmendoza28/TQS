import { Injectable } from "@angular/core";
import { Workbook } from 'exceljs';
const fs = require("file-saver")

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