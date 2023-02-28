import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';

@Component({
  selector: 'app-just-approved-idea',
  templateUrl: './just-approved-idea.component.html',
  styleUrls: ['./just-approved-idea.component.css'],
})
export class JustApprovedIdeaComponent implements OnInit {
  Organisation: any;
  organisationDomain: any;
  userId: any;
  allIdeas: any;
  filterIdeaKey: any;

  @Input() public Idea: string;

  constructor(
    public _orgService: OrganisationService,
    private _ideaService: IdeaService,
    private _route: Router,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    this._ideaService.listen().subscribe((m: any) => {
      this.refreshIdeaList();
    });
    this._ideaService.getApprovedIdea().subscribe((m: any) => {
      this.refreshIdeaList();
    });
  
  }

  ngOnInit(): void {
    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.organisationDomain =
          this.Organisation.organisations.organisationDomain;
        this.Organisation = this.Organisation.organisations.id;
        this.refreshIdeaList();
      },
      (error) => {}
    );
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

  refreshIdeaList() {
    // for getting just approved ideas
    var value = {
      organisationDomain: this.organisationDomain,
      status: 3,
    };

    this._ideaService.getJustApprovedIdeas(value).subscribe(
      (res) => {
   
        this.allIdeas = res;
        this.allIdeas = this.allIdeas.justApprovedIdeas;
      },
      (err) => {}
    );
  }

  onClick(idea: any) {
    if(!this.filterIdeaKey){
    this._route.navigateByUrl(
      '/organisation/idea-main-details-page?id=' +
        idea.id +
        '&OrganisationDomain=' +
        idea.organisationDomain
    );
    }
  }
}
