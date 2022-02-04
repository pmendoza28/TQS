import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CredServices } from '../../services/cred.service';
import { LocalService } from '../../services/local.service';
import { HeaderServices } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private localService: LocalService,
    private router: Router,
    public headerServices: HeaderServices,
    private credServices: CredServices
  ) { }

  @Output() toogleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() deviceXs: boolean
  loggingOut: boolean = false;
  

  ToogleSideBar() {
    this.toogleSidebar.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  logout() {
    this.loggingOut = true;
    this.headerServices.logOut().subscribe(() => {
      this.localService.clearToken()
      this.router.navigate([""])
    })
  }

  getNameOfUser() {
    const { user: {first_name, last_name} } = this.credServices.getCredentials();
    return `${first_name} ${last_name}`;
  }
  
}
