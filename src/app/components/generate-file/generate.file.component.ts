import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
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
    exportType: string = "";
    moduleSelected = new FormControl();

    modules: string[] = ['User-Accounts', 'Stores', 'Members'];
    generateDatabase() {
        this.isGeneratingDatabase = true;
        const selectedReport = {
            user_account: true,
            member: true,
            store: true,
            settings: true
        }
        this.generateFileServices.generateFile(selectedReport).subscribe(res => {
            console.log(res);
            this.isGeneratingDatabase = false
            const updatedDatabaseCyper: any = CryptoJS.AES.encrypt(JSON.stringify(res), 'secret key 123').toString()
            let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
            const fileName = `TQS Database - ${dateToday}`
            this.helpersServices.exportJsonData([updatedDatabaseCyper], fileName)
        })
    }

    validateCustomDatabase() {
        if(this.moduleSelected.value == null || this.moduleSelected.value.length == 0) return true
        return false
    }

    exportCustomDatabase() {
        this.isGeneratingDatabase = true
        this.moduleSelected.disable()
        
        const selectedReport = {
            user_account: false,
            member: false,
            store: false,
        }
        this.moduleSelected.value.map((module: any) => {
            if(module == "User-Accounts") selectedReport.user_account = true
            if(module == "Stores") selectedReport.store = true
            if(module == "Members") selectedReport.member = true
        })
        this.generateFileServices.generateFile(selectedReport).subscribe(res => {
            this.isGeneratingDatabase = false
            this.moduleSelected.enable()

            const updatedDatabaseCyper: any = CryptoJS.AES.encrypt(JSON.stringify(res), 'secret key 123').toString()
            let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
            const modules = this.moduleSelected.value.toString()
            const fileName = `TQS Custom Database - Modules: ${modules}   - ${dateToday}`
            this.helpersServices.exportJsonData([updatedDatabaseCyper], fileName)
        })
        
    }
}