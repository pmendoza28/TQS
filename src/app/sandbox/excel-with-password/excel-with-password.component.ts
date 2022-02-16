import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HelperServices } from "src/app/shared/services/helpers.service";
import exportFromJSON from 'export-from-json'
import * as moment from "moment";
import { asyncScheduler, from, Observable, of, Subject } from "rxjs";
import { concatMap, delay } from "rxjs/operators";
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

    employees: any = [
        {
            id: 1,
            name: "phil",
            salary: 10000
        },
        {
            id: 2,
            name: "josh",
            salary: 5000
        },
    ]

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
        var bytes = CryptoJS.AES.decrypt(earnedPointsCyper, 'secret key 123');
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


    loginForm: FormGroup = this.fb.group({
        username: ["", Validators.required],
        password: ["", Validators.required]
    })

    login() {
        alert(`logged in`)
    }

    loginValidation() {
        if (!this.loginForm.valid) {
            return true
        }
        return false;
    }

    numbers = [1, 2, 3];
    uploadedNumber: number = 0;
    sample = new Subject()
    ngOnInit(): void {
        from(this.numbers).pipe(
            concatMap(val => of(val).pipe(delay(500)))
        ).subscribe({
            next: (num) => {
                console.log(num)
                this.uploadedNumber++;
                if(this.numbers.length == this.uploadedNumber) {
                    setTimeout(() => {
                        this.sample.complete()
                    }, 1000);
                }
            },
            complete: () => {
                
                this.sample.subscribe({
                    next: (emit) => console.log(`emit`, emit),
                    complete: () => console.log(`done`)
                })

            }
        })

        console.log(Array(100))
    }
}

