import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  
  isExpanded = true;
  showSubMenu: boolean = false;
  isShowing = false;

  //Functions
  MouseEnter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  MouseLeave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

}
