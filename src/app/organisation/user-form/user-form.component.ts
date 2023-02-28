 import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { OrganisationService } from 'src/app/services/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { Country } from '@angular-material-extensions/select-country';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import {Location} from '@angular/common';
import { User } from 'src/app/models/user-model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  helper = new JwtHelperService();
  profile: string = '';
  cover: string = '';
  imageToUpload: File = null;
  coverImageToUpload: File = null;
  id: any;
  emailId: any;
  active: boolean;
  // roles:any[]=[];

  userImage: string = './../../assets/Users.png';
  userCoverImage: string = './../../assets/Users.png';

  userDetail: boolean = true;
  userRoles: boolean = false;
  userPermissions: boolean = false;
  PasswordSection: boolean = false;


  forgotPassword = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
  });





  roles = [
    { role: 'Administrator', select: false, value: 0 },
   // { role: 'Unlicensed User', select: false, value: 1 },
    { role: 'Licensed User', select: false, value: 2 },
    { role: 'Approver', select: false, value: 3 },
    { role: 'Moderator', select: false, value: 4 },
  ];

  myForm: FormGroup;

  userPermissionsForm = new FormGroup({
    canCreateIdea: new FormControl(''),
    canDeleteIdea: new FormControl(''),
    canApproveIdea: new FormControl(''),
    canAccessIdea: new FormControl(''),
  });

  OrganisationDomain: any;
  Organisation: any;
  OrganisationId: any;
  user: any;
  rolevalues: any;
  finalvalue: any;
  finalrole: string;
  loading: boolean = false;
  parentSelector: boolean = false;
  country: string;
  defaultCountry: any;
  dateOfBirth: any;
  dateOfJoining: any;
  dob: any;
  doj: any;
  userid: any;
  loggeduserid: any;
  isDisabled: boolean;
  InvalidUser: boolean;
  array:any[];
  role: any;
  userRolesVisibility: boolean;
  userCreateForm:FormGroup;
  userEditForm: FormGroup;
  submitted: boolean;
  UId: any;
  user_Id: any;
  constructor(
    private _userService: UserService,
    private orgService: OrganisationService,
    private _route: Router,
    private _toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _authservice:AuthService,
    private _location: Location,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    this.userCreateForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.email, Validators.required]),
      // mobileNo: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      headline: new FormControl(''),
      currentPosition: new FormControl(''),
      skills: new FormControl(''),
      location: new FormControl(''),
      address: new FormControl(''),
      dateOfBirth: new FormControl(''),
      dateOfJoining: new FormControl(''),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*#?&])(?=[^A-Z]*[A-Z]).{5,30}$/
        ),
      ]),
      confirmpswd: new FormControl('', [Validators.required]),
    },
    {
      validators: this.MustMatch('password','confirmpswd')

         }
    );
    this.userEditForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.email, Validators.required]),
      // mobileNo: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      headline: new FormControl(''),
      currentPosition: new FormControl(''),
      skills: new FormControl(''),
      location: new FormControl(''),
      address: new FormControl(''),
      dateOfBirth: new FormControl(''),
      dateOfJoining: new FormControl(''),
      active: new FormControl(''),
    },
    );
  }

  get f (){ return this.userCreateForm.controls}


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

    const user = this._authservice.getUser();
    const loggeduserid = user.id;
    this.UId = user.id;
    user.Roles= user.Roles.split("|");
    if (this._subdomain.toUpperCase() == 'WWW') {
      this._route.navigate(['/']);
    } else {
      this.orgService.checkIfDomainExist(this._subdomain).subscribe(
        (res: any) => {
          this.Organisation = res;
          this.OrganisationId = this.Organisation.organisations.id;
          this.OrganisationDomain =
            this.Organisation.organisations.organisationDomain;
        },
        (error: any) => {}
      );
    }
    let id = this._activatedRoute.snapshot.queryParams.id;
    this.user_Id = id;
    this.userid = this._activatedRoute.snapshot.queryParams.id;
    let organisationDomain =
      this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    var localuser = new User();
    localuser.Id = id;
    localuser.OrganisationDomain = organisationDomain;
    if (this.userid) {
      this._userService.getUserById(localuser).subscribe(
        (res: any) => {
          this.user = res;
          this.rolevalues = this.user.users.roles;
          let pic = this.user.users.userImage;
          if (pic == null) this.profile = '';
          else this.profile = this.user.users.userImage.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);
          //To Upload Cover Image By Ayush Kumar
          let coverPic = this.user.users.userCoverImage;
          if (coverPic == null) this.cover = '';
          else this.cover = this.user.users.userCoverImage.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);
          this.userEditForm.patchValue(res['users']);
         //userRole visible only for organisation
         if (user.Roles.includes("Admin"))
            {
                 this.userRolesVisibility = true;
            }
          for (var r of this.rolevalues) {
            this.roles.map((res) => {
              if (r == res.value) {
                res.select = true;
              }
              else if(this.rolevalues==1)
              {
                this.InvalidUser = true;
              }
            });
          }
        },
        (err) => {}
      );
    }
  }


  onChangeRole($event: any) {

    const value = $event.target.value;
    const isChecked = $event.target.checked;

    this.roles = this.roles.map((d) => {

      if (d.value == value) {
        d.select = isChecked;
        this.InvalidUser = false;
       return d;
      }
      if (value == 1) {
        d.select = false;
        this.array=[ 1];
        return d;
      }
      else{
        this.array=null
      }
      return d;
    });
    var arr: number[] = [];
    this.roles.map((f) => {
      if (f.select == true) {
      arr.push(f.value);
      }
    });
    this.finalvalue = (this.array !=null)?this.array:arr;

  }

  editDetail() {
    this.userDetail = true;
    this.userRoles = false;
    this.userPermissions = false;
    this.PasswordSection = false;
  }

  editRoles() {
    this.userRoles = true;
    this.userDetail = false;
    this.PasswordSection = false;
    this.userPermissions = false;
  }
  editPermissions() {
    this.userRoles = false;
    this.userDetail = false;
    this.userPermissions = true;
  }

  changePassword(){
    this.userRoles = false;
    this.userDetail = false;
    this.userPermissions = false;
    this.PasswordSection = true;
  }

  changePasswordSecurity(){
    let formData = new FormData();
    formData.append('UserId', this._authservice.getUser().id);
    formData.append('CurrentPassword', this.forgotPassword.value.currentPassword);
    formData.append('NewPassword', this.forgotPassword.value.newPassword);
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

  fileOnSelect(file: any) {
    this.imageToUpload = <File>file.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.profile = event.target.result;
    };
    reader.readAsDataURL(this.imageToUpload);
  }
  //TO Upload Cover Image By Ayush Kumar
  coverImageSelect(file: any) {
    this.coverImageToUpload = <File>file.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.cover = event.target.result;
    };
    reader.readAsDataURL(this.coverImageToUpload);
  }
  coverImageSelecting(file: any) {
    this.coverImageToUpload = <File>file.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.userCoverImage = event.target.result;
    };
    reader.readAsDataURL(this.coverImageToUpload);
  }
  fileOnSelecting(file: any) {
    this.imageToUpload = <File>file.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.userImage = event.target.result;
    };
    reader.readAsDataURL(this.imageToUpload);
  }



  convert(e: any) {
    var date = new Date(e),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  onSubmit() {

    this.submitted = true;
    if(this.userEditForm.invalid){
      return;
    }
  else{
    let formData = new FormData();
    formData.append('firstName', this.userEditForm.value.firstName);
    formData.append('lastName', this.userEditForm.value.lastName);
    formData.append('emailId', this.userEditForm.value.emailId);
    formData.append('mobileNo', this.userEditForm.value.mobileNo);
    formData.append('orgId', this.OrganisationId);
    formData.append('organisationDomain', this.OrganisationDomain);
    if (this.finalvalue) {
      for (let role of this.finalvalue) {
        formData.append('roles', role);
      }
    } else {
      for (let role of this.rolevalues) {
        formData.append('roles', role);
      }
    }

    if (this.imageToUpload)
      formData.append('ImageFile', this.imageToUpload, this.imageToUpload.name);
    else formData.append('ImageFile', '');
    if (this.coverImageToUpload)
      formData.append(
        'CoverImageFile',
        this.coverImageToUpload,
        this.coverImageToUpload.name
      );
    else formData.append('CoverImageFile', '');
    formData.append('id', this._activatedRoute.snapshot.queryParams.id);
    formData.append('active', this.userEditForm.value.active);
    if (this.userEditForm.value.headline)
      formData.append('headline', this.userEditForm.value.headline);
    else formData.append('headline', '');
    if (this.userEditForm.value.currentPosition)
      formData.append(
        'currentPosition',
        this.userEditForm.value.currentPosition
      );
    else formData.append('currentPosition', '');
    if (this.userEditForm.value.location)
      formData.append('location', this.userEditForm.value.location);
    else formData.append('location', '');
    if (this.userEditForm.value.address)
      formData.append('address', this.userEditForm.value.address);
    else formData.append('address', '');
    if (this.userEditForm.value.skills)
      formData.append('skills', this.userEditForm.value.skills);
    else formData.append('skills', '');
    this.dob = this.userEditForm.value.dateOfBirth;
    if (this.userEditForm.value.dateOfBirth)
      formData.append('dateOfBirth', this.convert(this.dob));
    else formData.append('dateOfBirth', '');
    this.doj = this.userEditForm.value.dateOfJoining;
    if (this.userEditForm.value.dateOfJoining)
      formData.append('dateOfJoining', this.convert(this.doj));
    else formData.append('dateOfJoining', '');
    this.loading = true;
    this._userService.updateUser(formData).subscribe(
      (res: any) => {
        this.loading = false;

        this._toastr.success('User Updated Successfully', '', {
          timeOut: 3000,
        });
        this._userService.refreshUser();
        this._location.back();
        // this._route.navigateByUrl(
        //   '/organisation/userdetail?id=' +
        //     this.userid +
        //     '&OrganisationDomain=' +
        //     this.OrganisationDomain
        // );
      },
      (error: { error: { ErrorMessage: string } }) => {
        this._toastr.error(error.error.ErrorMessage, '', {
          timeOut: 3000,
        });
        this.loading = false;
      }
    );
   }
 }

  onSave() {
    this.submitted = true;
    if(this.userCreateForm.invalid){
      return;
    }
    else{
      let formData = new FormData();
      formData.append('firstName', this.userCreateForm.value.firstName);
      formData.append('lastName', this.userCreateForm.value.lastName);
      formData.append('emailId', this.userCreateForm.value.emailId);
      formData.append('password', this.userCreateForm.value.password);
      formData.append('mobileNo', this.userCreateForm.value.mobileNo);
      if (this.userCreateForm.value.headline)
        formData.append('headline', this.userCreateForm.value.headline);
      else formData.append('headline', '');
      if (this.userCreateForm.value.currentPosition)
        formData.append(
          'currentPosition',
          this.userCreateForm.value.currentPosition
        );
      else formData.append('currentPosition', '');
      if (this.userCreateForm.value.location)
        formData.append('location', this.userCreateForm.value.location);
      else formData.append('location', '');
      if (this.userCreateForm.value.address)
        formData.append('address', this.userCreateForm.value.address);
      else formData.append('address', '');
      if (this.userCreateForm.value.skills)
        formData.append('skills', this.userCreateForm.value.skills);
      else formData.append('skills', '');
      this.dob = this.userCreateForm.value.dateOfBirth;
      if (this.userCreateForm.value.dateOfBirth)
        formData.append('dateOfBirth', this.convert(this.dob));
      else formData.append('dateOfBirth', '');
      this.doj = this.userCreateForm.value.dateOfJoining;
      if (this.userCreateForm.value.dateOfJoining)
        formData.append('dateOfJoining', this.convert(this.doj));
      else formData.append('dateOfJoining', '');
      formData.append('orgId', this.OrganisationId);
      formData.append('defaultRole', '1');
      formData.append('organisationDomain', this.OrganisationDomain);
      if (this.imageToUpload)
        formData.append('ImageFile', this.imageToUpload, this.imageToUpload.name);
      else formData.append('ImageFile', '');
      // if (this.coverImageToUpload)
      // formData.append('ImageFile', this.coverImageToUpload, this.coverImageToUpload.name);
      // else formData.append('ImageFile', '');
      this.loading = true;
      this._userService.createUser(formData).subscribe(
        (res: any) => {
          this.loading = false;
          this._toastr.success('User created successfully', '', {
            timeOut: 3000,
          });
          this.userCreateForm.reset();
          this.userCreateForm.value.country = '';
          this.userImage = './../../assets/Users.png';
          this._location.back();

        },
        (error: { error: { ErrorMessage: string } }) => {
          this._toastr.error(error.error.ErrorMessage, '', {
            timeOut: 3000,
          });
          this.loading = false;
        }
      );

    }
  }

}
