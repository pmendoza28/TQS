import { Injectable } from "@angular/core";
import exportFromJSON from 'export-from-json'
const CryptoJS = require("crypto-js");

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
        const bytes  = CryptoJS.AES.decrypt(data[0], 'secret key 123');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.table(JSON.parse(originalText))
        exportFromJSON({ data, fileName, exportType })
    }

}