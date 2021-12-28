import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HelperServices } from "src/app/shared/services/helpers.service";
import exportFromJSON from 'export-from-json'
import * as moment from "moment";
const CryptoJS = require("crypto-js");

@Component({
    selector: 'app-sandbox-excel-with-password',
    templateUrl: './excel-with-password.component.html',
    styleUrls: ['./excel-with-password.component.scss']
})

export class ExcelWithPasswordComponent {
    constructor(
        private fb: FormBuilder,
    ) { }

    data = [
        { member_id: 21, transaction_no: "4", amount: 200, points_earn: 20, transaction_datetime: moment().format("yyyy-M-D hh:mm:ss") },
    ]

    details = {
        dateGenerated: new Date(Date.now()).toLocaleDateString(),
        timeGenerated: new Date(Date.now()).toLocaleDateString()
    }
    
    export() {
        var earnedPointsCyper = CryptoJS.AES.encrypt(JSON.stringify(this.data), 'secret key 123').toString();
        var detailsCyper = CryptoJS.AES.encrypt(JSON.stringify(this.details), 'secret key 123').toString();
        var bytes  = CryptoJS.AES.decrypt(earnedPointsCyper, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        let data = [
            earnedPointsCyper,
            detailsCyper
        ]

        let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
        // console.log(`date today`, dateToday)
        console.log()
        const fileName = `Earned Points - ${dateToday}`
        const exportType = 'json'
        exportFromJSON({ data, fileName, exportType })
    }
}