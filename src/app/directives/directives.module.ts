import { NgModule } from "@angular/core";
import { NumberCommaDirective } from "./input.with.comma.directive";

@NgModule({
    declarations: [
        NumberCommaDirective
    ],
    exports: [
        NumberCommaDirective
    ]
})

export class DirectivesModule {

}