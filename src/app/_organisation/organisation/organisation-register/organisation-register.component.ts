import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/organisation.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-organisation-register',
  templateUrl: './organisation-register.component.html',
  styleUrls: ['./organisation-register.component.css'],
})
export class OrganisationRegisterComponent implements OnInit {
  ShowLoader = false;
  ErrorMessage: string;
  alerterr: boolean = false;
  successMessage: string;
  alertsuccess: boolean = false;
  fileData: string;
  siteKey: string;
  orgImage: string = '';
  imageToUpload: File = null;
  aFormGroup: FormGroup;
  registerForm: FormGroup;
  submitted:boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private _organisationservice: OrganisationService,
    public route: Router,
    private http: HttpClient
  )
  {
    this.siteKey = environment.captchaKey;
    this.registerForm = this.formBuilder.group({
      cname: new FormControl('', Validators.required),
      website: new FormControl(''),
      country: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      address: new FormControl(''),
      domain: new FormControl('', Validators.required),
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

    });


  }
  get f (){ return this.registerForm.controls}

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

  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
    });
    window.scroll(0, 0);
  }
  fileOnSelect(file: any) {
    this.imageToUpload = <File>file.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.orgImage = event.target.result;
    };
    reader.readAsDataURL(this.imageToUpload);
  }
  privacy() {}
  onSubmit() {

    this.submitted = true;
    if(this.registerForm.invalid){
      return;
    }
    else{

      this.ShowLoader = true;
    let formData = new FormData();
    formData.append('OrganisationName', this.registerForm.value.cname);
    formData.append('Address', this.registerForm.value.address);
    formData.append('Website', this.registerForm.value.website);
    formData.append('Country', this.registerForm.value.country);
    formData.append('OrganisationDomain', this.registerForm.value.domain);
    formData.append('EmailId', this.registerForm.value.email);
    formData.append('Password', this.registerForm.value.password);
    if(this.imageToUpload) 
    formData.append('ImageFile', this.imageToUpload, this.imageToUpload.name);
    this._organisationservice.createOrganisation(formData).subscribe(
      (res) => {
        this.alertsuccess = true;
        this.successMessage = 'Company Registered Successfully.';
        this.route.navigate(['/org/organisation-welcome']);
        this.registerForm.reset();
        this.orgImage = '';
      },
      (error) => {
        this.ShowLoader = false;
        this.ErrorMessage = error.error.ErrorMessage;
        this.alerterr = true;
      }
    );
    }

  }
}
