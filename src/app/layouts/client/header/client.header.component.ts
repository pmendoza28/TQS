import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { LocalService } from "src/app/shared/services/local.service";

@Component({
    selector: 'app-client-header',
    templateUrl: './client.header.component.html',
    styleUrls: ['./client.header.component.scss']
})

export class ClientHeaderComponent {
    constructor(
        private localService: LocalService,
        private router: Router,
        public credServices: CredServices
    ) {}
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
        this.localService.clearToken();
        this.router.navigate(['/login']).then(() => location.reload())
    }

    
}