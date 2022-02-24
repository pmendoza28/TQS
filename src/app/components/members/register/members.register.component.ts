import { Component } from "@angular/core";
import { MembersRegisterServices, TSteps } from "./members.register.service";

@Component({
  selector: 'app-members-register',
  templateUrl: './members.register.component.html',
  styleUrls: ['./members.register.component.scss']
})

export class MembersRegisterComponent {

  constructor(
    public membersRegisterServices: MembersRegisterServices
  ) {}

  stepTo(step: TSteps) {
    switch (step) {
      case 'Mobile Number':
        this.membersRegisterServices.steps = "Mobile Number";
        break;

      case 'Name':
        this.membersRegisterServices.steps = "Name";
        break;

      case 'Gender':
        this.membersRegisterServices.steps = "Gender";
        break;

      case 'Birthday':
        this.membersRegisterServices.steps = "Birthday";
        break;

      case 'Address':
        this.membersRegisterServices.steps = "Address";
        break;

      case 'Working':
        this.membersRegisterServices.steps = "Working";
        break;

      case 'Cooking':
        this.membersRegisterServices.steps = "Cooking";
        break;

      case 'Overview':
        this.membersRegisterServices.steps = "Overview";
        break;
    }
  }

  ngOnInit(): void {
    // window.onbeforeunload = (e) => {
    //   e = e || window.event;
    //   if(e) {
    //     e.returnValue = 'Sure?'
    //   }
    // }
    // this.membersRegisterServices.steps = "Mobile Number";
  }
}

