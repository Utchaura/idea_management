import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { IdeaContentComponent } from "./idea-content/idea-content.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { StartupPageComponent } from "./startup-page.component";
import { SubscriptionCardComponent } from "./subscription-card/subscription-card.component";



@NgModule({
    declarations:[
        NavbarComponent,
        StartupPageComponent,
        SubscriptionCardComponent,
        IdeaContentComponent,
        FooterComponent
    ],
    imports:[
        RouterModule
    ],
    exports:[
        NavbarComponent,
        StartupPageComponent,
        SubscriptionCardComponent,
        IdeaContentComponent,
        FooterComponent
    ]
})
export class StartupModule{}