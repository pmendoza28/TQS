import { Component } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { from, interval, Observable, of, Subject, zip } from 'rxjs';
import { concatMap, delay, map, take, tap, timeout } from 'rxjs/operators';
import { IActivateStoreBody, IMember, InstallationServices, IStore, IUser } from "./installation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { CredServices } from "src/app/shared/services/cred.service";
import { AppServices } from "src/app/app.service";
const CryptoJS = require("crypto-js");

@Component({
    selector: 'app-installation',
    templateUrl: './installation.component.html',
    styleUrls: ['./installation.component.scss']
})

export class InstallationComponent {
    constructor(
        private _formBuilder: FormBuilder,
        breakpointObserver: BreakpointObserver,
        private installationServices: InstallationServices,
        private snackbar: MatSnackBar,
        private helperServices: HelperServices,
        private credServices: CredServices,
        public appServices: AppServices
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }
    storeActivateForm = this._formBuilder.group({
        store_id: ['', Validators.required],
        token: ['', Validators.required]
    });
    uploadForm = this._formBuilder.group({
        db: ['', Validators.required],
    });
    stepperOrientation: Observable<StepperOrientation>;
    isValidatingToken: boolean = false;
    tokenValid: boolean = false;
    tokenValidationMessage: "Token is valid" | "Token is invalid";
    storeHint: string;
    stores: any = [];
    hide = true;

    ngOnInit(): void {
        this.populateStores();
        this.appServices.internetForm.valueChanges.subscribe(() => {
            this.populateStores();
        })
    }

    populateStores() {
        this.storeHint = "";
        this.installationServices.getStores().subscribe(res => {
            this.stores = res;
            this.storeHint = "Internet Connected"
        }, err => {
            const { name } = err;
            if (name == "HttpErrorResponse") this.storeHint = "Can't Connect to Admin"
        })
    }

    validateToken() {
        this.isValidatingToken = true;
       setTimeout(() => {
        this.installationServices.validateToken(this.storeActivateForm.value).subscribe(res => {
            const { message, valid } = res;
            this.isValidatingToken = false;
            this.tokenValidationMessage = message;
            this.tokenValid = valid;
            this.snackbar.open(message, "", { duration: 3000 })

        }, err => {
            console.log(err)
            const { error: { message, valid } } = err;
            this.isValidatingToken = false;
            this.tokenValidationMessage = message;
            this.tokenValid = valid;
            if(message) {
                this.snackbar.open(message, "", { duration: 3000 })
            }
            else {
                this.snackbar.open("Internet Connection Interrupt", "", { duration: 3000 })
                this.populateStores()
            }
            
        })
       }, 0);
    }
    hasInternet: boolean = false;
    uploadedPercentage: number = 0;
    uploadingDb: boolean = false;
    uploadErrors: TUploadError[] = [];
    moduleUploading: "Member" | "Store" | "User" | "Settings" = "User";
    UserDataLength: number = 0;
    StoreDataLength: number = 0;
    MemberDataLength: number = 0;
    uploadedUserData = 0;
    uploadedStoreData = 0;
    uploadedMemberData = 0;
    currentUploaded: number = 0;
    totalCurrentUploading = 0;
    totalRowCount: number = 0;
    totalUploadedRows: number = 0;
    UserDataSubject = new Subject();
    StoreDataSubject = new Subject();
    MemberDataSubject = new Subject();
    
    uploadDatabase() {
        this.uploadingDb = true;
        this.uploadingDb = true;
        const { db } = this.uploadForm.value;
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(db)
        fileReader.onload = async (event) => {
            const result: any = event.target?.result
            const resultObj = JSON.parse(result)
            const data = CryptoJS.AES.decrypt(resultObj[0], this.credServices.secretKey);
            const decryptedDb = JSON.parse(data.toString(CryptoJS.enc.Utf8))
            const { memberdata, storedata, userdata, settingdata } = decryptedDb;
            if(userdata) this.UserDataLength = userdata.length;
            if(storedata) this.StoreDataLength = storedata.length;
            if(memberdata) this.MemberDataLength = memberdata.length
            
            this.totalRowCount = this.UserDataLength + this.StoreDataLength  + this.MemberDataLength
            
            if (settingdata) this.totalRowCount++;

            if(this.UserDataLength > 0) {
                this.moduleUploading = "User";
                this.currentUploaded = 0
                this.totalCurrentUploading = this.UserDataLength;
                from(userdata).pipe(
                    concatMap(val => of(val).pipe(delay(100)))
                ).pipe(delay(100)).subscribe({
                    next: (user: any) => {
                        this.uploadUser(user)
                    }
                })
            }
            else {
                this.UserDataSubject.complete()
            }

            if(this.StoreDataLength > 0) {
                this.UserDataSubject.subscribe({
                    complete: () => {
                        this.moduleUploading = "Store";
                        this.currentUploaded = 0
                        this.totalCurrentUploading = this.StoreDataLength;
                        from(storedata).pipe(
                            concatMap(val => of(val).pipe(delay(100)))
                        ).pipe(delay(100)).subscribe({
                            next: (store: any) => {
                                console.log(store)
                                this.uploadStore(store)
                            }
                        })
                    }
                })
            }
            else {
                this.StoreDataSubject.complete()
            }

            if(this.MemberDataLength > 0) {
                this.StoreDataSubject.subscribe({
                    complete: () => {
                        this.moduleUploading = "Member";
                        this.currentUploaded = 0
                        this.totalCurrentUploading = this.MemberDataLength;
                        from(memberdata).pipe(
                            concatMap(val => of(val).pipe(delay(100)))
                        ).pipe(delay(100)).subscribe({
                            next: (member: any) => {
                                this.uploadMember(member)
                            }
                        })
                    }
                })
            }
            else {
                this.MemberDataSubject.complete()
            }

            if(settingdata) {
                this.MemberDataSubject.subscribe({
                    complete: () => {
                        this.moduleUploading = "Settings";
                        this.currentUploaded = 0;
                        this.totalCurrentUploading = 1
                        setTimeout(() => {
                            this.uploadSettings()
                        }, 500);
                    }
                })
            }
        }

    }
    

    uploadUser(user: any) {
        this.installationServices.createUser(user).subscribe(() => {
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.uploadedUserData++;
            this.totalUploadedRows++;
            this.currentUploaded = this.uploadedUserData;
            if ((this.uploadedUserData) == this.UserDataLength) {
                setTimeout(() => {
                    this.UserDataSubject.complete()
                }, 500);
            }
        }, (err) => {
            console.log(err)
            const { error, status, statusText } = err;
            this.uploadErrors.push({ error, statusCode: status, statusText, document: { type: "User", object: user } })
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.uploadedUserData++;
            this.totalUploadedRows++;
            this.currentUploaded = this.uploadedUserData;
            if ((this.uploadedUserData) == this.UserDataLength) {
                setTimeout(() => {
                    this.UserDataSubject.complete()
                }, 500);
            }
        });
    }

    uploadStore(store: any) {
        this.installationServices.createStore(store).subscribe(() => {
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.uploadedStoreData++;
            this.totalUploadedRows++;
            this.currentUploaded = this.uploadedStoreData;
            if ((this.uploadedStoreData) == this.StoreDataLength) {
                setTimeout(() => {
                    this.StoreDataSubject.complete()
                }, 500);
            }
        }, (err) => {
            const { error, status, statusText } = err;
            this.uploadErrors.push({ error, statusCode: status, statusText, document: { type: "Store", object: store } })
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.uploadedStoreData++;
            this.totalUploadedRows++;
            this.currentUploaded = this.uploadedStoreData;
            if ((this.uploadedStoreData) == this.StoreDataLength) {
                setTimeout(() => {
                    this.StoreDataSubject.complete()
                }, 500);
            }
        })
    }

    uploadMember(member: any) {
        this.installationServices.createMember(member).subscribe(() => {
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.uploadedMemberData++;
            this.totalUploadedRows++;
            this.currentUploaded = this.uploadedMemberData;
            if ((this.uploadedMemberData) == this.MemberDataLength) {
                setTimeout(() => {
                    this.MemberDataSubject.complete()
                }, 500);
            }
        }, (err) => {
            const { error, status, statusText } = err;
            this.uploadErrors.push({ error, statusCode: status, statusText, document: { type: "Member", object: member } })
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.uploadedMemberData++;
            this.totalUploadedRows++;
            this.currentUploaded = this.uploadedMemberData;
            if ((this.uploadedMemberData) == this.MemberDataLength) {
                setTimeout(() => {
                    this.MemberDataSubject.complete()
                }, 500);
            }
        })
    }

    uploadSettings() {
        const activateStoreBody: IActivateStoreBody = {
            store_mysql_id: this.storeActivateForm.value.store_id,
            token: this.storeActivateForm.value.token,
            activated_date: `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}`
        }
        this.totalUploadedRows++;
        this.installationServices.activateStore(activateStoreBody).subscribe(() => {
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.currentUploaded = 1;
        }, err => {
            this.uploadedPercentage = this.totalUploadedRows / this.totalRowCount * 100;
            this.currentUploaded = 1;
        })       
    }

    redirecting: number = 10;

}

type TCreatedStoreRes = { createdStore: any, statusCode: number, message: string }
type TCreatedMemberRes = { createdMember: object; statusCode: number; message: string }
type TCreatedUserRes = { createdUser: object, statusCode: number, message: string }
type TUploadError = { error: any; statusCode: number; statusText: string, document: { type: "Store" | "Member" | "User", object: any } }