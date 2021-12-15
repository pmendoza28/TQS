import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MembersTableComponent } from './table/members.table.component';
import { AdminContainerModule } from 'src/app/layouts/admin-container/admin.container.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  { path: '', component: MembersTableComponent}
]

@NgModule({
  declarations: [
    MembersTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminContainerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatButtonModule
  ]
})
export class MembersModule { }
