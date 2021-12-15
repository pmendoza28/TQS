import { NgModule } from "@angular/core";
import { TitleCaseDirective } from "./input.capitalize.directive";
import { OnlyNumberDirective } from "./input.number.only.directive";
import { UpperCaseDirective } from "./input.uppercase.directive";
import { NumberCommaDirective } from "./input.with.comma.directive";

@NgModule({
    declarations: [
        NumberCommaDirective,
        TitleCaseDirective,
        UpperCaseDirective,
        OnlyNumberDirective
    ],
    exports: [
        NumberCommaDirective,
        TitleCaseDirective,
        UpperCaseDirective,
        OnlyNumberDirective
    ]
})

export class DirectivesModule {

}