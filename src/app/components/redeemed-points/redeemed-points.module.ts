import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { RedeemedPointsTableComponent } from "./table/redeemed.points.table.component";

const routes: Routes = [
    { path: '', component: RedeemedPointsTableComponent }
]

@NgModule({
    declarations: [
        RedeemedPointsTableComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatMenuModule,
        MatButtonModule,
        MatPaginatorModule,
        CommonModule
    ]
})

export class RedeemedPointsModule {

}