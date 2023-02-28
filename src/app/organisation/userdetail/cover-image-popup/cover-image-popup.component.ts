import { Component, OnInit,Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {

  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-cover-image-popup',
  templateUrl: './cover-image-popup.component.html',
  styleUrls: ['./cover-image-popup.component.css']
})
export class CoverImagePopupComponent implements OnInit {
  //helper = new JwtHelperService();
  //profile: string = '';
  cover: string = '';
  //imageToUpload: File = null;
  coverImageToUpload: File = null;
  userCoverImage: string = './../../assets/Users.png';
  userDetail: boolean = true;
  userRoles: boolean = false;
  userPermissions: boolean = false;
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
 // id: any;
 // emailId: any;
 // active: boolean;
  constructor( private _userService: UserService,
    private orgService: OrganisationService,
    private _route: Router,
    private _toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _authservice:AuthService,
    private modalService: NgbModal,
    @Inject(SUB_DOMAIN) private _subdomain: string) { }

  ngOnInit(): void {
    const user = this._authservice.getUser();
    const loggeduserid = user.id;
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
    const id = this._activatedRoute.snapshot.queryParams.id;
    this.userid = this._activatedRoute.snapshot.queryParams.id;
    const organisationDomain =
      this._activatedRoute.snapshot.queryParams.OrganisationDomain;

    if (this.userid) {
      this._userService.getUserById({ id, organisationDomain }).subscribe(
        (res: any) => {
          this.user = res;
          this.rolevalues = this.user.users.roles;
          // let pic = this.user.users.userImage;
          // if (pic == null) this.profile = '';
          // else this.profile = this.user.users.userImage.imageSrc;
          //To Upload Cover Image By Ayush Kumar
          let coverPic = this.user.users.userCoverImage;
          if (coverPic == null) this.cover = '';
          else this.cover = this.user.users.userCoverImage.imageSrc+ '?' + Math.floor(1000000000 + Math.random() * 9000000000);

        },
        (err) => {}
      );
    }
  }

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
  onSubmit() {
    let formData = new FormData();
    formData.append('orgId', this.OrganisationId);
    formData.append('organisationDomain', this.OrganisationDomain);

    // To upload cover image By Ayush Kumar
    if (this.coverImageToUpload)
      formData.append(
        'CoverImageFile',
        this.coverImageToUpload,
        this.coverImageToUpload.name
      );
    else formData.append('CoverImageFile', '');
    formData.append('id', this._activatedRoute.snapshot.queryParams.id);
    this.loading = true;
    this._userService.uploadUserCoverImage(formData).subscribe(
      (res: any) => {
        this.loading = false;

        this._toastr.success('Cover Picture Uploaded Successfully', '', {
          timeOut: 3000,
        });

        this.modalService.dismissAll();
        //this._route.navigateByUrl('organisation/userdetail');

        this._userService.coverImageUpdate(formData);

      },
      (error: { error: { ErrorMessage: string } }) => {
        this.loading = false;
      }
    );
  }

}
