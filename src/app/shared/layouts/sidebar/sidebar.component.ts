import { Component, OnInit } from '@angular/core';
import { CredServices } from '../../services/cred.service';
import { SidebarServices } from './sidebar.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    public sideBarServices: SidebarServices,
    public credServices: CredServices,
  ) { }

  isExpanded = true;
  showSubMenu: boolean = false;
  isShowing = false;

  

  checkAccess(accessParam: string) {
    let { user: { access_permission } } = this.credServices.getCredentials()
    let hasAccess = access_permission.some((access: string) => access == accessParam)
    return hasAccess
  }

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
