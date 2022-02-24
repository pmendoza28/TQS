import { Component } from "@angular/core";
import { CredServices } from "src/app/shared/services/cred.service";

@Component({
    selector: 'app-client-sidebar',
    templateUrl: './client.sidebar.component.html',
    styleUrls: ['./client.sidebar.component.scss']
})

export class ClientSidebarComponent {
    constructor(
        public credServices: CredServices
    ) {}
    
}