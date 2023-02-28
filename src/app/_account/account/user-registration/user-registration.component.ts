import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Organisation } from 'src/app/models/organisation-model';
import { OrganisationService } from 'src/app/services/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements OnInit {
  organisation: any;
  showLoader = false;
  siteKey: string;
  userRegisterForm: FormGroup;

  constructor(
    private _userservice: UserService,
    private _orgservice: OrganisationService,
    private _route: Router,
    private fb:FormBuilder,
    private _toastr: ToastrService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    this.siteKey = environment.captchaKey;
    this.userRegisterForm =this.fb.group({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      // mobile: new FormControl('', [ Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      recaptcha: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*#?&])(?=[^A-Z]*[A-Z]).{5,30}$/
        ),
      ]),
      confirmpswd: new FormControl('', [Validators.required]),
      privacycheck: new FormControl('', Validators.required),
    },
   {
     validators: this.MustMatch('password','confirmpswd')
          }
    );
  }


  MustMatch(controlName:string,matchingControlName:string){
    return (formGroup:FormGroup)=>{
      const control =formGroup.controls[controlName]
      const matchingControl =formGroup.controls[matchingControlName]
    if(matchingControl.errors && !matchingControl.errors.MustMatch)
    {
      return
    }
    if(control.value !== matchingControl.value)
    {
      matchingControl.setErrors({MustMatch:true})
    }
    else{
      matchingControl.setErrors(null);
    }
    }
  }





  ngOnInit(): void {
    if (this._subdomain.toUpperCase() == 'WWW') {
      this._route.navigate(['/']);
    } else {
      this._orgservice.checkIfDomainExist(this._subdomain).subscribe(
        (res) => {
          this.organisation = res;
        },
        (error) => {}
      );
    }
  }

  privacyCheck() {}

  onSubmit() {
    this.showLoader = true;
    let formData = new FormData();
    formData.append('firstName', this.userRegisterForm.value.firstname);
    formData.append('lastName', this.userRegisterForm.value.lastname);
    formData.append('emailId', this.userRegisterForm.value.email);
    formData.append('password', this.userRegisterForm.value.password);
    formData.append('mobileNo', this.userRegisterForm.value.mobile);
    formData.append('orgId', this.organisation.organisations.id);
    formData.append(
      'organisationDomain',
      this.organisation.organisations.organisationDomain
    );
    formData.append('defaultRole', '1');
    this._userservice.createUser(formData).subscribe(
      (res) => {
        this._toastr.success('User Registered Successfully', '', {
          timeOut: 3000,
        });
        this.showLoader = false;
        this.userRegisterForm.reset();
      },
      (error) => {
        this._toastr.warning(error.error.ErrorMessage, '', {
          timeOut: 3000,
        });
        this.showLoader = false;
      }
    );
  }
}
