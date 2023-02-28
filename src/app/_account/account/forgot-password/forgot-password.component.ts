import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });
  OrganisationId: any;
  Organisation: any;
  OrganisationDomain: any;
  coverImageToUpload: any;
  _activatedRoute: any;
  loading: boolean;
  modalService: any;

  constructor(private _authservice: AuthService,
    private _route: Router,
    private _ideaService: IdeaService,
    private _toastr: ToastrService,
    private _userService: UserService,
    private _orgservice: OrganisationService,
    @Inject(SUB_DOMAIN) private _subdomain: string) {}

  ngOnInit(): void {
    if (this._subdomain.toUpperCase() == 'WWW') {
      this._route.navigate(['/']);
    } else {
      this._orgservice.checkIfDomainExist(this._subdomain).subscribe(
        (res: any) => {
          this.Organisation = res;
          this.OrganisationId = this.Organisation.organisations.id;
        },
        (error: any) => {}
      );
  }
  }
  onSubmit() {
    let formData = new FormData();
    formData.append('EmailId', this.forgotPassword.value.email);
    formData.append('organisationDomain', this._subdomain);
    formData.append('password', this.forgotPassword.value.password);
    this._userService.changePassword(formData).subscribe(
      (res: any) => {

        this._toastr.success('Password has been successfully changed' , '', {
          timeOut: 3000,
        });

       this._route.navigateByUrl('account/login');

      },
      (error: { error: { ErrorMessage: string } }) => {
      }
    );
  }
}
