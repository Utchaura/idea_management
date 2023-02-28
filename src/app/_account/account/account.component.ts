import { Component, Inject, OnInit } from '@angular/core';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  hostName: string;
  organisationLogo = '';
  Organisation: any;
  constructor(
    private _orgService: OrganisationService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {
    this.hostName = this._subdomain.toUpperCase();
    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.organisationLogo =
          this.Organisation.organisations.organizationLogo.imageSrc +
          '?' +
          Math.random().toString(16).substr(2, 8).toUpperCase();
      },
      (error) => {}
    );
  }
}
