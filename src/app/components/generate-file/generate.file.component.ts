import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

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
    exportType: string = "";
    moduleSelected = new FormControl();

    modules: string[] = ['User-Accounts', 'Stores', 'Members'];
    generateDatabase() {
        this.isGeneratingDatabase = true
        this.generateFileServices.generateDatabase().subscribe(res => {
            setTimeout(() => {
                this.isGeneratingDatabase = false
                const updatedDatabaseCyper: any = CryptoJS.AES.encrypt(JSON.stringify(res), 'secret key 123').toString()
                let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
                const fileName = `TQS Database - ${dateToday}`
                this.helpersServices.exportJsonData([updatedDatabaseCyper], fileName)
            }, 1000);
        })
    }

    validateCustomDatabase() {
        if(this.moduleSelected.value == null || this.moduleSelected.value.length == 0) {
            return true
        }
        else {
            return false
        }
    }

    exportCustomDatabase() {
        this.isGeneratingDatabase = true
        this.moduleSelected.disable()
        this.generateFileServices.generateDatabase().subscribe(res => {
            const { user_accounts, stores, members } = res;
            this.isGeneratingDatabase = false
            this.moduleSelected.enable()
            let customData: any;
            this.moduleSelected.value.forEach((module: any) => {
                if(module == "User-Accounts") customData = {...customData, user_accounts: user_accounts}
                if(module == "Stores") customData = { ...customData, stores: stores}
                if(module == "Members") customData = {...customData, members: members}
            })
            const updatedDatabaseCyper: any = CryptoJS.AES.encrypt(JSON.stringify(customData), 'secret key 123').toString()
            let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
            const modules = this.moduleSelected.value.toString()
            console.log(`modules`, modules)
            const fileName = `TQS Custom Database - Modules: ${modules}   - ${dateToday}`
            this.helpersServices.exportJsonData([updatedDatabaseCyper], fileName)

        })
        
    }
}