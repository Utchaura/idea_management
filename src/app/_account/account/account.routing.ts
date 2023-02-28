import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./account.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserRegistrationComponent } from "./user-registration/user-registration.component";

const routes: Routes=[
    {
        path: '',
        component: AccountComponent,
        children: [
          { path: 'login', component: UserLoginComponent },
          { path: 'user-registration', component: UserRegistrationComponent },
          { path: 'forgot-password', component: ForgotPasswordComponent },
        ],
      }
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class AccountRouteModule{}