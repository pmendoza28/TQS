import { Component } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { Subscription } from "rxjs";
import { LayoutAdminServices } from "./layout.admin.service";

type NewType = Subscription;

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout.admin.component.html',
  styleUrls: ['./layout.admin.component.scss']
})

export class LayoutAdminComponent {
  constructor(
    public mediaObserver: MediaObserver,
    private layoutAdminServices: LayoutAdminServices
  ) { }

  mediaSub: NewType
  deviceXs: boolean = true;
  sidebarOpen: boolean = true;

  ngOnInit(): void {
    this.mediaQuery()
    // this.checkIfLoggedIn()
  }


  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }


  SideBarToggler() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  mediaQuery() {
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.deviceXs = result.mqAlias === 'xs' ? true : false
      if (this.deviceXs == true) {
        this.sidebarOpen = false
      }
      else {
        this.sidebarOpen = true
      }
    })
  }

  checkIfLoggedIn() {
    this.layoutAdminServices.checkIfLoggedIn().subscribe(res => {
      console.log(res)
    })
  }
}