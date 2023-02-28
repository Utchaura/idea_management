import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';

@Component({
  selector: 'app-recent-change-idea',
  templateUrl: './recent-change-idea.component.html',
  styleUrls: ['./recent-change-idea.component.css']
})
export class RecentChangeIdeaComponent implements OnInit {




  Organisation: any;
  organisationDomain: any;
  userId: any;
  allIdeas: any;
  filterIdeaKey: any;



  constructor(public _orgService: OrganisationService,
    private _ideaService: IdeaService,
    private _route: Router,
    private elementRef: ElementRef,
    @Inject(SUB_DOMAIN) private _subdomain:string) {
      
      this._ideaService.listenIdeaDeleted().subscribe((Id)=>{
        
        if(this.allIdeas.filter((d: { id: any; })=>d.id ==Id)){
          this.refreshIdeaList();
        }
      })
      this._ideaService. getRecentUpdatedIdea().subscribe(() => {
        this.refreshIdeaList();
     });
   

    }
  ngOnInit(): void {
    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.organisationDomain = this.Organisation.organisations.organisationDomain;
        this.Organisation =this.Organisation.organisations.id;
        this.refreshIdeaList();
      },
      (error) => {
      }
    )
    this._ideaService.HashClickEvent.subscribe((e) => {

      this.filterIdeaKey = e;
     });
    this._ideaService.AtTheClickEvent.subscribe((e) => {

      this._route.navigateByUrl(
        '/organisation/userdetail?id=' +
        e +
        '&OrganisationDomain=' +
        this.organisationDomain
      );
    });
  }



  refreshIdeaList(){


    // for getting recently changed ideas
    this._ideaService.getRecentlyChangedIdeas(this.organisationDomain).subscribe(
      (res) => {
        this.allIdeas = res;
        this.allIdeas = this.allIdeas.recentlyChangedIdeas;
      },
      (err) => {

      }
    );
  }

  onClick(idea:any)
  {
    if(!this.filterIdeaKey){
  this._route.navigateByUrl('/organisation/idea-main-details-page?id='+idea.id +'&OrganisationDomain='+idea.organisationDomain)
  }
}

}

