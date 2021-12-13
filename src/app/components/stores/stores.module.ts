import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresTableComponent } from './table/stores.table.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminContainerModule } from 'src/app/layouts/admin-container/admin.container.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { StoresNewComponent } from './new/stores.new.component';

const routes: Routes = [
  { path: '', component: StoresTableComponent },
  { path: 'new', component: StoresNewComponent },
]

@NgModule({
  declarations: [
    StoresTableComponent,
    StoresNewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminContainerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ]
})
export class StoresModule { }
