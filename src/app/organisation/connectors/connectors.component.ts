import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit {

  helper = new JwtHelperService();

  enableSpmIntegration: boolean = false;

  IntegrationForm = new FormGroup({
    isSpmEnabled: new FormControl(''),
    isCwmEnabled: new FormControl(''),
    isJiraEnabled: new FormControl(''),
  });

  TokenManagement = new FormGroup({
    Token: new FormControl('', Validators.required),
  });
  user: any;
  loading: boolean = false;
  loggeduserid: any;
  show: boolean = true;
  decodedMagicToken: any;
  tokenExpDate: number;

  constructor(private _authservice: AuthService,
              private _userService: UserService,
              private _toastr: ToastrService,
             @Inject(SUB_DOMAIN) private _subdomain: string
    ) { }

  ngOnInit(): void {
    const magicToken = window.sessionStorage.getItem('magic-token');
    this.decodedMagicToken = this.helper.decodeToken(magicToken);
    console.log(magicToken);
    const date = new Date(0);
    this.tokenExpDate = date.setUTCSeconds(this.decodedMagicToken.exp);
    const user = this._authservice.getUser();
    this.loggeduserid = user.id;
    var localuser = new User();
    localuser.Id = this.loggeduserid;
    localuser.OrganisationDomain = this._subdomain;
    this._userService.getUserById(localuser).subscribe(
      (res: any) => {
        this.user = res;
        this.IntegrationForm = new FormGroup({
          isSpmEnabled: new FormControl(
            this.user.users['isSpmEnabled']
          ),
          isCwmEnabled: new FormControl(
            this.user.users['isCwmEnabled']
          ),
          isJiraEnabled: new FormControl(
            this.user.users['isJiraEnabled']
          ),

        });
        this.IntegrationForm.value.isSpmEnabled ? this.enableSpmIntegration = true : this.enableSpmIntegration  = false;
        if(this.IntegrationForm.value.isSpmEnabled || !this.IntegrationForm.value.isSpmEnabled){
          this.show = false
        }
      },
      (err) => {}
    );
  }

  onChange() {
    this.enableSpmIntegration = !this.enableSpmIntegration;
    if(this.IntegrationForm.value.isSpmEnabled === true)
    {
      if(this.TokenManagement.value.Token != "")
      this.show = false;
      else
      this.show = true;
    }
    else{
      this.show = false;
    }
  }

  modelChange(){
    if(this.IntegrationForm.value.isSpmEnabled === true)
    {
      if(this.TokenManagement.value.Token != "")
      this.show = false;
      else
      this.show = true;
    }
  }

  onSubmit(){
    let user = this._authservice.getUser();
    this.IntegrationForm.value.isCwmEnabled = false;
    this.IntegrationForm.value.isJiraEnabled = false;
    let formData = new FormData();
    formData.append('Id', user.id);
    formData.append('OrganisationDomain', this._subdomain);
    formData.append('SpmToken', this.TokenManagement.value.Token);
    formData.append('IsSpmEnabled', this.IntegrationForm.value.isSpmEnabled);
    formData.append('IsCwmEnabled', this.IntegrationForm.value.isCwmEnabled);
    formData.append('IsJiraEnabled', this.IntegrationForm.value.isJiraEnabled);

    this._userService.changeIntegrationSetting(formData).subscribe(
      (res: any) => {
        this._toastr.success('Integration setting changed successfully', '', {
          timeOut: 3000,
        });
      },
      (error: { error: { ErrorMessage: string } }) => {
      }
    );
  }

}
