import { Component, Inject, OnInit } from '@angular/core';
import { OrganisationService } from './shared/organisation.service';
import { SUB_DOMAIN } from './shared/subdomain.token';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  organisation: any;
  constructor(
    private _orgService: OrganisationService,
    private _authService: AuthService,
    private _route: Router,
    private _toastr: ToastrService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {


    let windowUrl = window.location.href;
    let url = 'http://' + this._subdomain + '.poideamanagement.com:4200/';
    var user = this._authService.getToken();
    // let url = 'http://'+ this._subdomain +'.uwideahub.com/'

    if (this._subdomain.toUpperCase() == 'WWW') {
      this._route.navigate(['/']);
    }
    else {
      if (url == windowUrl) {
        if(user){
          this._route.navigate(['/organisation/idea-main/fresh-idea']);
        }
        else{
          this._route.navigate(['/account/login']);
        }
      }
      else {
        this._orgService.checkIfDomainExist(this._subdomain).subscribe(
          (res) => {
            this.organisation = res;
            if (!this._authService.loggedIn()) {
              this._authService.logoutUser();
              this._route.navigate(['/account/login']);
            }
          },
          (error) => {}
        );
      }
    }
}

  }
