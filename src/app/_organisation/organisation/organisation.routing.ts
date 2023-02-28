import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrganisationRegisterComponent } from "./organisation-register/organisation-register.component";
import { OrganisationWelcomeComponent } from "./organisation-welcome/organisation-welcome.component";
import { OrganisationSiteComponent } from "./organisation.component";

const routes: Routes = [
    {
        path: '' , 
        component: OrganisationSiteComponent,
        children:[
            {path: '' , redirectTo: 'organisation-register' , pathMatch: "full"},
            { path: 'organisation-register', component: OrganisationRegisterComponent },
            { path: 'organisation-welcome', component: OrganisationWelcomeComponent },
        ]
    },
    
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class OrganisationSiteRoutingModule{}