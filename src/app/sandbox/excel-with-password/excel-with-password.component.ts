import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HelperServices } from "src/app/shared/services/helpers.service";
import exportFromJSON from 'export-from-json'
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
        { member_id: 1, transaction_no: "1", amount: 10, points_earn: 10, transaction_datetime: `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}` },
        { member_id: 2, transaction_no: "2", amount: 10, points_earn: 10, transaction_datetime: `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}` },
        { member_id: 3, transaction_no: "3", amount: 10, points_earn: 10, transaction_datetime: `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}` },
        { member_id: 4, transaction_no: "4", amount: 10, points_earn: 10, transaction_datetime: `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}` },
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
        console.log(`date today`, dateToday)
        const fileName = `Earned Points - ${dateToday}`
        const exportType = 'json'
        exportFromJSON({ data, fileName, exportType })
    }
}