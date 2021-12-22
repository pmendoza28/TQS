import { Injectable } from "@angular/core";
import { Workbook } from 'exceljs';
const fs = require("file-saver")

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

    exportExcel(excelData: any) {
      const { title, header, data, columnColorNumber, worksheetName } = excelData;
    
        //Create a workbook with a worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(worksheetName);
    
    
        //Add Row and formatting
        worksheet.mergeCells('C1', 'L4');
        let titleRow = worksheet.getCell('C1');
        titleRow.value = title
        titleRow.font = {
          name: 'Calibri',
          size: 16,
          underline: 'single',
          bold: true,
          color: { argb: '0085A3' }
        }
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    
        // Date
        // worksheet.mergeCells('G1:H4');
        let d = new Date();
        let date = d.toLocaleDateString()
    
    
        // Add Image
        // let myLogoImage = workbook.addImage({
        //   base64: logo.imgBase64,
        //   extension: 'png',
        // });
        worksheet.mergeCells('A1:B4');
        // worksheet.addImage(myLogoImage, 'A1:B4');
    
        //Blank Row 
        worksheet.addRow([]);
    
        //Adding Header Row
        let headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4167B8' },
            bgColor: { argb: '' }
          }
          cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
            size: 12
          }
        })
    
        // Adding Data with Conditional Formatting
        data.forEach((d: any) => {
          let row = worksheet.addRow(d);
    
          let amount: any = row.getCell(columnColorNumber);
          let color = 'FF99FF99';
          if (+amount.value < 200000) {
            color = 'FF9999'
          }
    
          amount.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
          }
        }
        );
    
        worksheet.getColumn(3).width = 20;
        worksheet.addRow([]);
    
        //Footer Row
        let footerRow = worksheet.addRow(['Generated date: ' + date]);
        footerRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFB050' }
        };
    
        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    
        //Generate & Save Excel File
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, title + '.xlsx');
        })
    
      }
}