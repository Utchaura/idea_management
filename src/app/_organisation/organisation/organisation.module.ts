import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxCaptchaModule } from "ngx-captcha";
import { StartupModule } from "src/app/startup-page/startup.module";

import { OrganisationRegisterComponent } from "./organisation-register/organisation-register.component";
import { OrganisationWelcomeComponent } from "./organisation-welcome/organisation-welcome.component";
import { OrganisationSiteComponent } from "./organisation.component";
import { OrganisationSiteRoutingModule } from "./organisation.routing";

@NgModule({
    declarations:[
        OrganisationSiteComponent,
        OrganisationWelcomeComponent,
        OrganisationRegisterComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxCaptchaModule,
        OrganisationSiteRoutingModule,
        RouterModule,
        StartupModule
    ]
})
export class OrganizationModule{}