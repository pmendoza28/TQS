import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    private headerServices: HeaderServices
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
  
}
