import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrganisationService } from 'src/app/services/organisation.service';
import { SUB_DOMAIN } from 'src/app/domain/subdomain.token';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { IdeaService } from 'src/app/services/idea.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  showLoader = false;
  user: User;

  helper = new JwtHelperService();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });

  organisationDomain: any;
  organisation: any;
  organisationId: any;

  constructor(
    private _authservice: AuthService,
    private _route: Router,
    private _ideaService: IdeaService,
    private _toastr: ToastrService,
    private _userService: UserService,
    private _orgservice: OrganisationService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}
  ngOnInit() {
    if (this._subdomain.toUpperCase() == 'WWW') {
      this._route.navigate(['/']);
    } else {
      this._orgservice.checkIfDomainExist(this._subdomain).subscribe(
        (res) => {
          this.organisation = res;
          this.organisationDomain =
            this.organisation.organisations.organisationDomain;
          this.organisationId =
            this.organisation.organisations.id;
          // localStorage.setItem("ideahubOrganization" , JSON.parse(this.organisation))
        },
         (error) => {}
      );
    }
  }

  onSubmit() {
    this.showLoader = true;
    this.user = new User();
    this.user.EmailId = this.loginForm.value.email;
    this.user.Password = this.loginForm.value.password;
    this.user.OrgId = this.organisationId;

    this._authservice.loginUser(this.user).subscribe(
      (res) => {
        this._toastr.success('Login successful', '', {
          timeOut: 3000,
        });
        let response = res;
        let user = this.helper.decodeToken(response.token);
        this._authservice.saveToken(response.token);
        this._authservice.saveMagicToken(response.magicToken);
        this._authservice.saveUser(user);

        localStorage.setItem('token', response.token);
        this._ideaService.ideaStatusTitle('Fresh Ideas');
        this._route.navigate(['../../organisation/idea-main/fresh-idea']);
      },
      (error) => {
        this.showLoader = false;
          this._toastr.error(error.error.ErrorMessage, '', {
            timeOut: 3000,
          });
        }
    );
  }

  getCurrentUser(id: string) {
    let user = new User();
    user.Id = id;
    this._userService.getCurrentUser(user).subscribe(
      (res) => {

      },
      (error) => {}
    );
  }
}
