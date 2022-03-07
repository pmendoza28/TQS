import { Injectable } from "@angular/core";
import exportFromJSON from 'export-from-json'
const CryptoJS = require("crypto-js");
import { Workbook } from 'exceljs';
import { TextError } from "src/app/interfaces/errors";
import { MatSnackBar } from "@angular/material/snack-bar";
const fs = require("file-saver")

@Injectable({
  providedIn: "root"
})

export class HelperServices {

  constructor(
    private snackbar: MatSnackBar
  ) {}
  hasInternet: boolean;
  today = new Date()

  filterTable(event: Event, dataSource: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportJsonData(data: any, fileName: string, exportType: any = 'json') {
    const bytes = CryptoJS.AES.decrypt(data[0], 'secret key 123');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.table(JSON.parse(originalText))
    exportFromJSON({ data, fileName, exportType })
  }

  exportExcel(excelData: any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const columnColorNumber = excelData.columnColorNumber
    const titleMergeCell = {
      from: excelData.titleMergeCell.from,
      to: excelData.titleMergeCell.to
    }

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');

    //Add Row and formatting
    worksheet.mergeCells(titleMergeCell.from, titleMergeCell.to);
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '303030' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    // worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.toLocaleDateString()


    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '303030' },
        bgColor: { argb: '  ' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      worksheet.addRow(d);
    });

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  exportCSV(excelData: any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const columnColorNumber = excelData.columnColorNumber
    const titleMergeCell = {
      from: excelData.titleMergeCell.from,
      to: excelData.titleMergeCell.to
    }

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');

    //Add Row and formatting
    worksheet.mergeCells(titleMergeCell.from, titleMergeCell.to);
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '303030' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    // worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.toLocaleDateString()


    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '303030' },
        bgColor: { argb: '  ' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      worksheet.addRow(d);
    });

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.csv');
    })

  }

  decryptDb(encryptedDb: any) {
    const bytes  = CryptoJS.AES.decrypt(encryptedDb, 'secret key 123');
    const originalDb = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalDb);
  }

  isOk(httpResponse: any) {
    console.log(`httpResponse`,httpResponse)
    if(httpResponse.status != 200) {
      return false
    }
    return true;

  }

  catchError(err: any, hasDuration: boolean, duration?: number) {
    console.log(`err`,err)
    let error: TextError = ""
    if(err.status == 500) {
      error = "Something went wrong";
    }
    if(err.status == 400) {
      if(err.error.message == "User Not Found!!") {
        error = "No Data Found"
      }
    }
    if(err.name == "TimeoutError") {
      error = "Server cannot be reach. Please Try Again Later";
    }
    if(err.statusText == "Unknown Error") {
      error = "Something went wrong";
    }
    if(hasDuration) {
      this.snackbar.open(error, "", { duration })
    }
    if(!hasDuration) {
      this.snackbar.open(error, "")
    }
    return error;
  }
}