import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { MembersServices } from "../members.service";
import * as XLSX from 'xlsx';
import { MatTable, MatTableDataSource } from "@angular/material/table";
@Component({
    selector: 'app-members-dialog',
    templateUrl: './members.dialog.component.html',
    styleUrls: ['./members.dialog.component.scss']
})

export class MembersDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<MembersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private membersServices: MembersServices,
        private router: Router,
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private helpersServices: HelperServices,
        private dialog: MatDialog
    ) { }

    isButtonLoading: boolean = false;
    fileUploadForm: FormGroup | any = this.fb.group({
        memberExcelFile: [null]
    })
    excelData: any[] = []
    @ViewChild("tblMembers") tblMembers: MatTable<any>

    ngOnInit(): void {
        console.log(this.data)
    }

    create() {
        this.isButtonLoading = true;
        this.data.button_name = "Creating";
        const { memberForm } = this.data;
        this.membersServices.createMember(memberForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Create";
            console.log(res)
            const { data, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if (data) {
                this.dialogRef.close();
                this.router.navigate(["/admin/members"])
            }
        })
    }

    update() {
        this.isButtonLoading = true;
        this.data.button_name = "Updating";
        const { memberId, memberForm } = this.data;
        this.membersServices.updateMemberbyId(memberId, memberForm).subscribe(res => {
            console.log(res)
            const { isUpdated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if (isUpdated) {
                this.dialogRef.close()
                this.router.navigate(["/admin/members"])
            }
        })
    }

    ActivateInActive() {
        this.isButtonLoading = true;
        if (this.data.button_name == "Deactivate") {
            this.data.button_name = "Deactivating";
            const { member: { id } } = this.data;
            if (this.data.button_name == "Deactivating") {
                this.membersServices.updateStatusById(id, false).subscribe(res => {
                    this.data.button_name = "Deactivate";
                    const { isDeactivated, message } = res;
                    this.snackBar.open(message, "", { duration: 3000 })
                    if (isDeactivated) {
                        this.dialogRef.close({
                            memberId: id,
                            status: "Inactive",
                        })
                    }
                })
            }
        }
        if (this.data.button_name == "Activate") {
            this.data.button_name = "Activating";
            const { member: { id } } = this.data;
            this.membersServices.updateStatusById(id, true).subscribe(res => {
                this.data.button_name = "Activate";
                const { isActivated, message } = res;
                this.snackBar.open(message, "", { duration: 3000 })
                if (isActivated) {
                    this.dialogRef.close({
                        memberId: id,
                        status: "Active",
                    })
                }
            })
        }
    }

    discard() {
        this.router.navigate(["/admin/members"])
        this.dialogRef.close()
    }

    displayedColumns = [
        'errors',
        'row',
        'first_name',
        'last_name',
        'gender',
        'birthday',
        'barangay',
        'municipality',
        'province',
        'email',
        'mobile_number',
        'actions',
    ];

    dataSource = new MatTableDataSource<IMemberDataSource>();
    allErrors: any[] = [];

    fetchErrors() {
        return `${this.allErrors.join(", ")}, TOTAL ERRORS: ${this.allErrors.length}`
    }

    import() {
        this.excelData = []
        this.allErrors = [];
        this.dataSource.data = [];
        this.readyToUpload = false;
        const { memberExcelFile } = this.fileUploadForm.value
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(memberExcelFile)
        fileReader.onload = (event) => {
            let binaryData = event.target?.result;
            let workbook = XLSX.read(binaryData, { type: "binary" })
            workbook.SheetNames.forEach(sheet => {
                this.excelData.push({
                    sheetName: sheet,
                    data: XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                })
            })
            this.excelData[0].data.map((member: IMemberDataSource, index: number) => {
                let errors: string[] = [];

                if (member.first_name == undefined || member.first_name == "") {
                    this.allErrors.push(`No First Name # ${index + 1}`)
                    errors.push("First Name is required")
                }

                if (member.last_name == undefined || member.last_name == "") {
                    this.allErrors.push(`No Last Name # ${index + 1}`)
                    errors.push("Last Name is required")
                }

                if (member.gender == undefined || member.gender == "") {
                    this.allErrors.push(`No Gender # ${index + 1}`)
                    errors.push("Gender is required")
                }

                if (member.birthday == undefined || member.birthday == "") {
                    this.allErrors.push(`No Birthday # ${index + 1}`)
                    errors.push("Birthday is required")
                }

                if (member.barangay == undefined || member.barangay == "") {
                    this.allErrors.push(`No Barangay # ${index + 1}`)
                    errors.push("Barangay is required")
                }

                if (member.municipality == undefined || member.municipality == "") {
                    this.allErrors.push(`No Municipality # ${index + 1}`)
                    errors.push("Municipality is required")
                }

                if (member.province == undefined || member.province == "") {
                    this.allErrors.push(`No Province # ${index + 1}`)
                    errors.push("Province is required")
                }

                if (member.email == undefined || member.email == "") {
                    this.allErrors.push(`No Email # ${index + 1}`)
                    errors.push("Email is required")
                }

                if (member.mobile_number == undefined || member.mobile_number == "") {
                    this.allErrors.push(`No Mobile Number # ${index + 1}`)
                    errors.push("Mobile number is required")
                }

                if (member.mobile_number) {
                    if (member.mobile_number.length != 11) {
                        this.allErrors.push(`Mobile Number is not 11 digits # ${index + 1}`)
                        errors.push(`Mobile number is only ${member.mobile_number.length} digits`)
                    }
                }

                this.dataSource.data.push({
                    row: index + 1,
                    first_name: member.first_name != undefined ? member.first_name : "",
                    last_name: member.last_name != undefined ? member.last_name : "",
                    gender: member.gender != undefined ? member.gender : "",
                    birthday: member.birthday != undefined ? member.birthday : "",
                    barangay: member.barangay != undefined ? member.barangay : "",
                    municipality: member.municipality != undefined ? member.municipality : "",
                    province: member.province != undefined ? member.province : "",
                    email: member.email != undefined ? member.email : "",
                    mobile_number: member.mobile_number != undefined ? member.mobile_number : "",
                    is_active: member.is_active != undefined ? member.is_active : "",
                    error: errors,
                    isEdit: false
                })

            })

            let { duplicateMobileNumbers } = this.checkDuplicateMobileNumbers();
            if (duplicateMobileNumbers.length > 0) {
                duplicateMobileNumbers.map(duplicateMobileNumber => this.allErrors.push(`Duplicate Mobile Numbers at row ${duplicateMobileNumber.row}`))
            }
        }
    }

    applyFilter(event: Event) {
        this.helpersServices.filterTable(event, this.dataSource)
    }

    edit(rowNumber: number) {
        let index = this.dataSource.data.findIndex((member: IMemberDataSource) => member.row == rowNumber)
        this.dataSource.data[index].isEdit = true;
        console.log(this.dataSource.data)
    }

    allFieldAreFillUp() {
        let yeah =  this.dataSource.data.some((member: IMemberDataSource) => member.first_name.trim() == "" || member.last_name.trim() == "" || member.gender.trim() == "" || member.birthday == "" || member.barangay.trim() == "" || member.municipality.trim() == "" || member.province.trim() == "" || member.email.trim() == ""|| member.mobile_number.trim() == "") 
        return yeah
    }

    ok(rowNumber: number) {
        let index = this.dataSource.data.findIndex((member: IMemberDataSource) => member.row == rowNumber)
        this.dataSource.data[index].isEdit = false;
        this.allErrors = [];
        
        
        this.dataSource.data.map((member: IMemberDataSource, index: number) => {
            let errors: string[] = [];

            if (member.first_name == undefined || member.first_name == "") {
                this.allErrors.push(`No First Name # ${index + 1}`)
                errors.push("First Name is required")
            }

            if (member.last_name == undefined || member.last_name == "") {
                this.allErrors.push(`No Last Name # ${index + 1}`)
                errors.push("Last Name is required")
            }

            if (member.gender == undefined || member.gender == "") {
                this.allErrors.push(`No Gender # ${index + 1}`)
                errors.push("Gender is required")
            }

            if (member.birthday == undefined || member.birthday == "") {
                this.allErrors.push(`No Birthday # ${index + 1}`)
                errors.push("Birthday is required")
            }

            if (member.barangay == undefined || member.barangay == "") {
                this.allErrors.push(`No Barangay # ${index + 1}`)
                errors.push("Barangay is required")
            }

            if (member.municipality == undefined || member.municipality == "") {
                this.allErrors.push(`No Municipality # ${index + 1}`)
                errors.push("Municipality is required")
            }

            if (member.province == undefined || member.province == "") {
                this.allErrors.push(`No Province # ${index + 1}`)
                errors.push("Province is required")
            }

            if (member.email == undefined || member.email == "") {
                this.allErrors.push(`No Email # ${index + 1}`)
                errors.push("Email is required")
            }

            if (member.mobile_number == undefined || member.mobile_number == "") {
                this.allErrors.push(`No Mobile Number # ${index + 1}`)
                errors.push("Mobile number is required")
            }
            if (member.mobile_number) {
                if (member.mobile_number.length != 11) {
                    this.allErrors.push(`Mobile Number is not 11 digits # ${index + 1}`)
                    errors.push(`Mobile number is only ${member.mobile_number.length} digits`)
                }
            }
            this.dataSource.data[index].error = errors;
        })
        let { duplicateMobileNumbers } = this.checkDuplicateMobileNumbers();
        if (duplicateMobileNumbers.length > 0) {
            duplicateMobileNumbers.map(duplicateMobileNumber => this.allErrors.push(`Duplicate Mobile Numbers at row ${duplicateMobileNumber.row}`))
        }

        if(this.validateQuery) {
            this.membersServices.validateMembers(this.dataSource.data).subscribe(res => {
                const { memberExists } = res;
                if(memberExists.length == 0) {
                    this.readyToUpload = true
                    this.snackBar.open("All Mobile Numbers are not yet registered. Upload Members to proceed", "", { duration: 3000})
                }
                if(memberExists.length > 0) {
                    this.readyToUpload = false;
                    memberExists.map((mobileNumber: any) => {
                        this.dataSource.data.map((member: IMemberDataSource) => {
                            if(member.mobile_number == mobileNumber.mobile_number) {
                                this.allErrors.push(`Mobile Number at row ${member.row} is already exists`)
                                member.error?.push(`Mobile number is already exists`)
                            }
                        })
                    })
                }
            })
        }
      
      
    }

    isEditAll: boolean = false;
    editAll() {
        this.isEditAll = !this.isEditAll;
        if(this.isEditAll) {
            this.dataSource.data.map((member: IMemberDataSource) => member.isEdit = true)
        }
        if(!this.isEditAll) {
            this.dataSource.data.map((member: IMemberDataSource) => member.isEdit = false)
        }
        
    }

    remove(rowNumber: number) {
        this.dataSource.data.splice(this.dataSource.data.findIndex((member: IMemberDataSource ) => member.row == rowNumber), 1)
        this.tblMembers.renderRows()
    }

    validateMember(member: IMemberDataSource) {
        if (member.first_name.trim() == "" || member.last_name.trim() == "" || member.gender.trim() == "" || member.barangay.trim() == "" || member.municipality.trim() == "" || member.province.trim() == "" || member.email.trim() == "" || member.mobile_number.trim() == "") {
            return true
        }
        if (member.mobile_number.length != 11) {
            return true
        }
        else {
            return false
        }
    }

    validateUploadMembers() {
        if (this.allErrors.length > 0) {
            return true
        }
        else {
            return false;
        }
    }

    checkDuplicateMobileNumbers() {
        let duplicateMobileNumbers: any[] = [];
        this.dataSource.data.forEach((member: IMemberDataSource) => {
            let duplicate = this.dataSource.data.filter((filterMember: IMemberDataSource) => filterMember.mobile_number == member.mobile_number && filterMember.row != member.row)
            if (duplicate.length > 0) {
                duplicateMobileNumbers.push({
                    row: member.row,
                    mobile_number: member.mobile_number,
                })
            }
        })
        return { duplicateMobileNumbers }
    }

    uploadMembers() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to Import this members?",
                button_name: "Import",
                action: "import-members",
                members: this.dataSource.data
            }
        }).afterClosed().subscribe(res => {
            if(res) {
                this.dialogRef.close(res)
            }
        })
    }

    checkIfEditingTable() {
        let ifEditing = this.dataSource.data.some((member: IMemberDataSource) => member.isEdit == true)
        return ifEditing
    }

    btnImport: string = "Import";
    readyToUpload: boolean = false;
    isValidating: boolean = false;
    btnValidate: "Validate Mobile Numbers" | "Validating Mobile Numbers" = "Validate Mobile Numbers";
    validateQuery: boolean  = false;
    validateMembers() {
        this.validateQuery = true
        this.isValidating = true;
        this.btnValidate = "Validating Mobile Numbers";
        this.allErrors = []
        this.membersServices.validateMembers(this.dataSource.data).subscribe(res => {
            const { memberExists } = res;
            if(memberExists.length == 0) {
                this.readyToUpload = true
                this.snackBar.open("All Mobile Numbers are not yet registered. Upload Members to proceed", "", { duration: 3000})
            }
            if (memberExists.length > 0) {
                this.readyToUpload = false;
                memberExists.map((mobileNumber: any) => {
                    this.dataSource.data.map((member: IMemberDataSource) => {
                        if (member.mobile_number == mobileNumber.mobile_number) {
                            this.allErrors.push(`Mobile Number at row ${member.row} is already exists`)
                            member.error?.push(`Mobile number is already exists`)
                        }
                    })
                })
            }
            this.btnValidate = "Validate Mobile Numbers";
            this.isValidating = false;
        })

    }

    importMembers() {
        this.isButtonLoading = true;
        this.btnImport = "Importing";
        this.membersServices.importMembers(this.data.members).subscribe(res => {
            console.log(res)
            let { message, memberExists,imported_members } = res;
            if (memberExists.length > 0) {
                message = "Selected Members are already exists"
            }
            this.snackBar.open(message, "", { duration: 3000 })
            this.isButtonLoading = false;
            this.btnImport = "Import";
            this.dialogRef.close({
                isImported: true,
                imported_members
            })
        })

    }
}

interface IMemberDataSource {
    row: number;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    barangay: string;
    municipality: string;
    province: string;
    email: string;
    mobile_number: string;
    is_active: string;
    error?: string[];
    isEdit: boolean;
}