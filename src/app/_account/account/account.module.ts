import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxCaptchaModule } from "ngx-captcha";
import { StartupModule } from "src/app/startup-page/startup.module";
import { AccountComponent } from "./account.component";
import { AccountRouteModule } from "./account.routing";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserRegistrationComponent } from "./user-registration/user-registration.component";

@NgModule({
    declarations:[
        AccountComponent,
        UserLoginComponent,
        UserRegistrationComponent,
        ForgotPasswordComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxCaptchaModule,
        RouterModule,
        AccountRouteModule,
        StartupModule
    ]
})
export class AccountModule{}