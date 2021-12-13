import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppServices } from './app.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private appServices : AppServices,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.appServices.createOnline$().subscribe(isOnline => {
      this.appServices.isOnline = isOnline;
      if(!isOnline) {
        this.dialog.open(DialogComponent, {
          disableClose: true,
          data: {
            title: "Notification!",
            content: "No Internet Connection!...",
          }
        })
      }
    })
  }  
}