import { Component } from "@angular/core";

import exportFromJSON from 'export-from-json'
import { HelperServices } from "src/app/shared/services/helpers.service";
import { GenerateFileServices } from "./generate-file.service";
const CryptoJS = require("crypto-js");

@Component({
    selector: 'app-generate-file',
    templateUrl: './generate.file.component.html',
    styleUrls: ['./generate.file.component.scss']
})

export class GenerateFileComponent {

    constructor(
        private generateFileServices: GenerateFileServices,
        private helpersServices: HelperServices
    ) { }

    /** @States */
    title: string = "Generate File";
    isGeneratingDatabase: boolean = false;
    generateDatabase() {
        this.isGeneratingDatabase = true
        this.generateFileServices.generateDatabase().subscribe(res => {
            setTimeout(() => {
                this.isGeneratingDatabase = false
                const updatedDatabaseCyper: any = CryptoJS.AES.encrypt(JSON.stringify(res), 'secret key 123').toString()
                let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
                const fileName = `Updated Database - ${dateToday}`
                this.helpersServices.exportJsonData([updatedDatabaseCyper], fileName)
            }, 1000);
        })
    }
}