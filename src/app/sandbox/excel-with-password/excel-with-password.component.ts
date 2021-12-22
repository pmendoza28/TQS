import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HelperServices } from "src/app/shared/services/helpers.service";
const ExcelJS = require('exceljs');

@Component({
    selector: 'app-sandbox-excel-with-password',
    templateUrl: './excel-with-password.component.html',
    styleUrls: ['./excel-with-password.component.scss']
})

export class ExcelWithPasswordComponent {
    constructor(
        private fb: FormBuilder,
        private helperServices: HelperServices
    ) { }

    data = [
        { member_id: 1, points: 10, date_earned: Date.now() },
        { member_id: 1, points: 10, date_earned: Date.now() },
        { member_id: 1, points: 10, date_earned: Date.now() },
        { member_id: 1, points: 10, date_earned: Date.now() },
    ]

    datas: any[] = []
    export() {
        this.data.forEach((row: any) => {
            this.datas.push(Object.values(row))
          })
        let reportData = {
            title: "Sample",
            data: this.datas,
            header: Object.keys(this.data[0]),
            columnColorNumber: 8,
            worksheetName: "Members"
            
        }
        this.helperServices.exportExcel(reportData)
    }
}