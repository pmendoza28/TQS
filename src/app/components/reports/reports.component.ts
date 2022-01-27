import { Component } from "@angular/core";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsEarnedPointsComponent } from './earned-points/reports.earned.points.component';
import { ReportsRedeemedPointsComponent } from './redeemed-points/reports.redeemed.points.component';
import { ReportClearedPointsComponent } from './cleared-points/reports.cleared.points.component';
import { IGenerateReportBody, ReportsServices } from "./reports.service";
import * as moment from "moment";
@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})

export class ReportsComponent {

    constructor(
        public helperServices: HelperServices,
        public reporstServices: ReportsServices
    ) { }

    /** @States */
    title: string = "Reports"
    reports: string[] = [
        "Earned-Points",
        "Redeemed-Points",
        "Cleared-Points",
    ]
   
    componentRender: any;
    selectedCategories: string[] = [];
    basedDateRanges: string[] = []
    
    /** @Earned_Points */
    isGenerating: boolean = false
    earnedPointsCategory: string[] = ["Synched", "Uploaded"]
    earnedPointsStatus: string[] = ["Not Cleared", "Cleared"]
    selectedStatus: string[] = []
    selectedDateRanged: any;

    ngOnInit(): void {
        this.reporstServices.selectedReport = "";
    }

    /** @Validations */
    validateBeforeGenerate() {
        if (this.reporstServices.selectedReport && this.reporstServices.range.value.start && this.reporstServices.range.value.end && this.selectedDateRanged) return true
        if (this.reporstServices.selectedReport == "Cleared-Points" && this.reporstServices.range.value.start && this.reporstServices.range.value.end) return true;
        return false;
    }

    validateDateRangedBased() {
        if (this.reporstServices.selectedReport == "Earned-Points" || this.reporstServices.selectedReport == "Redeemed-Points") {
            return true
        }
        return false;
    }

    /** @Methods */
    setBasedDateRange() {
        this.reporstServices.selectedBasedDateRange = "";
        this.componentRender = null;
        this.reporstServices.range.patchValue({ start: "", end: "" })
        this.selectedDateRanged = ""
        this.selectedCategories = []
        this.selectedStatus = []
        if (this.reporstServices.selectedReport == "Earned-Points") this.basedDateRanges = ["Date Synched / Upload", "Date Earned", "Date Cleared Points"]
        if (this.reporstServices.selectedReport == "Redeemed-Points") this.basedDateRanges = ["Date Synched", "Date Redeemed"]
        if (this.reporstServices.selectedReport == "Cleared-Points") this.basedDateRanges = ["Date Cleared"]
    }

    generate() {
        this.isGenerating = true;
        this.reporstServices.range.disable()
        this.componentRender =""
        this.reporstServices.selectedBasedDateRange = this.selectedDateRanged
        this.reporstServices.selectedDateRange = {
            start: this.reporstServices.range.value.start,
            end: this.reporstServices.range.value.end,
        }

        const reportBodyRequest: IGenerateReportBody = {
            selectedReport: this.reporstServices.selectedReport,
            dateRangedBased: this.selectedDateRanged,
            dateRanged: {
                start: moment(this.reporstServices.range.value.start).format("yyyy-MM-DD"),
                end: moment(this.reporstServices.range.value.end).format("yyyy-MM-DD"),
            },
            category: this.selectedCategories,
            status: this.selectedStatus
        }

        this.reporstServices.generateReport(reportBodyRequest).subscribe(res => {
            console.log(res);

            this.isGenerating = false;
            this.reporstServices.range.enable()
            if(this.reporstServices.selectedReport == "Earned-Points") {
                this.reporstServices.earnedPointsReportDataSource.data = res
                this.componentRender = ReportsEarnedPointsComponent;
            }

            if(this.reporstServices.selectedReport == "Redeemed-Points") {
                this.reporstServices.redeemedPointsReportDataSource.data = res;
                this.componentRender = ReportsRedeemedPointsComponent;
            }
            if(this.reporstServices.selectedReport == "Cleared-Points") {
                this.reporstServices.clearedPointsReportDataSource.data = res;
                this.componentRender = ReportClearedPointsComponent;
            }
        })

       
    }

}