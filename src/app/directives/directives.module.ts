import { NgModule } from "@angular/core";
import { TitleCaseDirective } from "./input.capitalize.directive";
import { UpperCaseDirective } from "./input.uppercase.directive";
import { NumberCommaDirective } from "./input.with.comma.directive";

@NgModule({
    declarations: [
        NumberCommaDirective,
        TitleCaseDirective,
        UpperCaseDirective
    ],
    exports: [
        NumberCommaDirective,
        TitleCaseDirective,
        UpperCaseDirective
    ]
})

export class DirectivesModule {

}