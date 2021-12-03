import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  @Output() toogleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() deviceXs: boolean
  
  ToogleSideBar() {
    this.toogleSidebar.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  logout() {
    this.localService.clearToken()
    this.router.navigate([""])
  }
}
