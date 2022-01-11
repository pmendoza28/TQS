import { Injectable } from "@angular/core";
import { Workbook } from 'exceljs';
import exportFromJSON from 'export-from-json'
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

    exportJsonData(data: any, fileName: string, exportType: any = 'json') {
        exportFromJSON({ data, fileName, exportType })
    }

}