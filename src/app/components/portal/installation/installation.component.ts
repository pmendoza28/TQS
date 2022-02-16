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
       }, 3000);
    }
    hasInternet: boolean = false;
    uploadedPercentage: number = 0;
    uploadingDb: boolean = false;
    uploadErrors: TUploadError[] = [];
    moduleUploading: "Member" | "Store" | "User" | "Settings" = "User";
    customUserData: any = [];
    customStoreData: any = [];
    customMemberData: any = []
    uploadedUserData = 0;
    uploadedStoreData = 0;
    uploadedMemberData = 0;
    currentUploaded: number = 0;
    totalCurrentUploading = 0;
    totalRowCount: number;
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
            this.customUserData = await userdata.map((user: IUser) => {
                return {
                    user_mysql_id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    password: "sample password"
                }
            })
            this.customStoreData = await storedata.map((store: IStore) => {
                return {
                    store_mysql_id: store.id,
                    business_category_id: store.businesscategory_id,
                    code: store.code,
                    name: store.name,
                    area: store.area,
                    region: store.region,
                    cluster: store.cluster,
                    business_model: store.business_model,
                    token: store.token
                }
            }) 
            this.customMemberData = await memberdata.map((member: IMember) => {
                return {
                    member_mysql_id: member.id,
                    first_name: member.first_name,
                    last_name: member.last_name,
                    gender: member.gender,
                    birthday: member.birthday,
                    email: member.email,
                    barangay: member.barangay,
                    municipality: member.municipality,
                    province: member.province,
                    mobile_number: member.mobile_number

                }
            })
            this.totalRowCount = await Number(memberdata.length) + Number(storedata.length) + Number(userdata.length);
            if (settingdata) this.totalRowCount++;

            if(this.customUserData.length > 0) {
                this.moduleUploading = "User";
                this.currentUploaded = 0
                this.totalCurrentUploading = this.customUserData.length;
                from(this.customUserData).pipe(
                    concatMap(val => of(val).pipe(delay(500)))
                ).pipe(delay(100)).subscribe({
                    next: (user: any) => {
                        this.uploadUser(user)
                    }
                })
            }
            else {
                this.UserDataSubject.complete()
            }

            if(this.customStoreData.length > 0) {
            
                this.UserDataSubject.subscribe({
                    complete: () => {
                        this.moduleUploading = "Store";
                        this.currentUploaded = 0
                        this.totalCurrentUploading = this.customStoreData.length;
                        from(this.customStoreData).pipe(
                            concatMap(val => of(val).pipe(delay(500)))
                        ).pipe(delay(100)).subscribe({
                            next: (store: any) => {
                                this.uploadStore(store)
                            }
                        })
                    }
                })
            }
            else {
                this.StoreDataSubject.complete()
            }

            if(this.customMemberData.length > 0) {
                this.StoreDataSubject.subscribe({
                    complete: () => {
                        this.moduleUploading = "Member";
                        this.currentUploaded = 0
                        this.totalCurrentUploading = this.customMemberData.length;
                        from(this.customMemberData).pipe(
                            concatMap(val => of(val).pipe(delay(500)))
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

    createTables() {

    }

    uploadUser(user: any) {
        this.installationServices.createUser(user).subscribe(() => {
            this.uploadedPercentage = this.uploadedPercentage + this.uploadedUserData / this.totalRowCount * 100;
            this.uploadedUserData++;
            this.currentUploaded = this.uploadedUserData;
            if ((this.uploadedUserData) == this.customUserData.length) {
                setTimeout(() => {
                    this.UserDataSubject.complete()
                }, 500);
            }
        }, (err) => {
            console.log(err)
            const { error, status, statusText } = err;
            this.uploadErrors.push({ error, statusCode: status, statusText, document: { type: "User", object: user } })
            this.uploadedPercentage = this.uploadedPercentage + this.uploadedUserData / this.totalRowCount * 100;
            this.uploadedUserData++;
            this.currentUploaded = this.uploadedUserData;
            if ((this.uploadedUserData) == this.customUserData.length) {
                setTimeout(() => {
                    this.UserDataSubject.complete()
                }, 500);
            }
        });
    }

    uploadStore(store: any) {
        this.installationServices.createStore(store).subscribe(() => {
            this.uploadedPercentage = this.uploadedPercentage + this.uploadedStoreData / this.totalRowCount * 100;
            this.uploadedStoreData++;
            this.currentUploaded = this.uploadedStoreData;
            if ((this.uploadedStoreData) == this.customStoreData.length) {
                setTimeout(() => {
                    this.StoreDataSubject.complete()
                }, 500);
            }
        }, (err) => {
            const { error, status, statusText } = err;
            this.uploadErrors.push({ error, statusCode: status, statusText, document: { type: "Store", object: store } })
            this.uploadedPercentage = this.uploadedPercentage + this.uploadedStoreData / this.totalRowCount * 100;
            this.uploadedStoreData++;
            this.currentUploaded = this.uploadedStoreData;
            if ((this.uploadedStoreData) == this.customStoreData.length) {
                setTimeout(() => {
                    this.StoreDataSubject.complete()
                }, 500);
            }
        })
    }

    uploadMember(member: any) {
        this.installationServices.createMember(member).subscribe(() => {
            this.uploadedPercentage = this.uploadedPercentage + this.uploadedMemberData / this.totalRowCount * 100;
            this.uploadedMemberData++;
            this.currentUploaded = this.uploadedMemberData;
            if ((this.uploadedMemberData) == this.customMemberData.length) {
                setTimeout(() => {
                    this.MemberDataSubject.complete()
                }, 500);
            }
        }, (err) => {
            const { error, status, statusText } = err;
            this.uploadErrors.push({ error, statusCode: status, statusText, document: { type: "Member", object: member } })
            this.uploadedPercentage = this.uploadedPercentage + this.uploadedMemberData / this.totalRowCount * 100;
            this.uploadedMemberData++;
            this.currentUploaded = this.uploadedMemberData;
            if ((this.uploadedMemberData) == this.customMemberData.length) {
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
        this.installationServices.activateStore(activateStoreBody).subscribe(() => {
            this.uploadedPercentage = this.uploadedPercentage + 1 / this.totalRowCount * 100;
            this.currentUploaded = 1;
        }, err => {
            this.uploadedPercentage = this.uploadedPercentage + 1 / this.totalRowCount * 100;
            this.currentUploaded = 1;
        })       
    }

    redirecting: number = 10;

}

type TCreatedStoreRes = { createdStore: any, statusCode: number, message: string }
type TCreatedMemberRes = { createdMember: object; statusCode: number; message: string }
type TCreatedUserRes = { createdUser: object, statusCode: number, message: string }
type TUploadError = { error: any; statusCode: number; statusText: string, document: { type: "Store" | "Member" | "User", object: any } }