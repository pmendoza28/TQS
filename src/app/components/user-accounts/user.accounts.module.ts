import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountTableComponent } from './table/user.accounts.table.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AdminContainerModule } from 'src/app/layouts/admin-container/admin.container.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  { path: '', component: UserAccountTableComponent },
]

@NgModule({
  declarations: [
    UserAccountTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    AdminContainerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class UserAccountsModule { }
