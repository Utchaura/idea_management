import { Component, Inject, OnInit } from '@angular/core';
import { OrganisationService } from 'src/app/services/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-organisation-manage',
  templateUrl: './organisation-manage.component.html',
  styleUrls: ['./organisation-manage.component.css'],
})
export class OrganisationManageComponent implements OnInit {
  editFormactive: boolean = false;
  organisationDetail: boolean = true;
  organisationAuthSetting: boolean = false;
  organisationManagement: boolean = false;
  orgImage: string = '';
  imageToUpload: File = null;
  loading: boolean = false;

  editOrganisationForm = new FormGroup({
    organisationName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    domain: new FormControl({ value: '', disabled: true }),
    maxFileSizeLimit: new FormControl('', Validators.required),
  });

  authenticationSetting = new FormGroup({
    isGoogleEnable: new FormControl(),
    isFacebookEnable: new FormControl(),
    isMicrosoftEnable: new FormControl(),
    isLinkedInEnable: new FormControl(),
    isGitHubEnable: new FormControl(),
  });
  userPermission = new FormGroup({
    enableSelfRegister: new FormControl(),
    enableDislike: new FormControl(),
    enableCustomTagging: new FormControl(),
  });

  Organisation: any;

  constructor(
    public _orgService: OrganisationService,
    private _toastr: ToastrService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {
    if (this._subdomain.toUpperCase() == 'WWW') {
    } else {
      this._orgService.checkIfDomainExist(this._subdomain).subscribe(
        (res: any) => {
          this.Organisation = res;
          this.orgImage = this.Organisation.organisations.organizationLogo ?
            this.Organisation.organisations.organizationLogo.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000) : null;
          let fileSize =
            this.Organisation.organisations.maxFileSizeLimit / 1024;
          this.editOrganisationForm = new FormGroup({
            organisationName: new FormControl(
              this.Organisation.organisations['organisationName']
            ),
            country: new FormControl(
              this.Organisation.organisations['country']
            ),
            website: new FormControl(
              this.Organisation.organisations['website']
            ),
            address: new FormControl(
              this.Organisation.organisations['address']
            ),
            domain: new FormControl({
              value: this.Organisation.organisations['organisationDomain'],
              disabled: true,
            }),
            maxFileSizeLimit: new FormControl(fileSize),
          });

          this.authenticationSetting = new FormGroup({
            isGoogleEnable: new FormControl(
              this.Organisation.organisations['isGoogleEnable']
            ),
            isFacebookEnable: new FormControl(
              this.Organisation.organisations['isFacebookEnable']
            ),
            isMicrosoftEnable: new FormControl(
              this.Organisation.organisations['isMicrosoftEnable']
            ),
            isLinkedInEnable: new FormControl(
              this.Organisation.organisations['isLinkedInEnable']
            ),
            isGitHubEnable: new FormControl(
              this.Organisation.organisations['isGitHubEnable']
            ),
          });

          this.userPermission = new FormGroup({
            enableSelfRegister: new FormControl(
              this.Organisation.organisations['selfRegistration']
            ),
            enableDislike: new FormControl(
              this.Organisation.organisations['activeDislike']
            ),
            enableCustomTagging: new FormControl(
              this.Organisation.organisations['allowCustomTagging']
            ),
          });
        },
        (error: any) => {}
      );
    }
  }

  fileOnSelect(file: any) {
    this.imageToUpload = <File>file.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.orgImage = event.target.result;
    };
    reader.readAsDataURL(this.imageToUpload);
  }

  editDetail() {
    this.organisationAuthSetting = false;
    this.organisationManagement = false;
    this.organisationDetail = true;
  }
  editAuthSetting() {
    this.organisationManagement = false;
    this.organisationDetail = false;
    this.organisationAuthSetting = true;
  }
  editManagement() {
    this.organisationDetail = false;
    this.organisationAuthSetting = false;
    this.organisationManagement = true;
  }

  editOrganisation() {
    this.editFormactive = true;
  }

  onChange() {}

  SaveOrganisationSetting() {
    let formData = new FormData();
    formData.append('id', this.Organisation.organisations.id);
    formData.append(
      'organisationName',
      this.editOrganisationForm.value.organisationName
    );
    formData.append('address', this.editOrganisationForm.value.address);
    formData.append('website', this.editOrganisationForm.value.website);
    formData.append('country', this.editOrganisationForm.value.country);
    formData.append(
      'maxFileSizeLimit',
      this.editOrganisationForm.value.maxFileSizeLimit
    );
    formData.append(
      'isGoogleEnable',
      this.authenticationSetting.value.isGoogleEnable
    );
    formData.append(
      'isFacebookEnable',
      this.authenticationSetting.value.isFacebookEnable
    );
    formData.append(
      'isMicrosoftEnable',
      this.authenticationSetting.value.isMicrosoftEnable
    );
    formData.append(
      'isLinkedInEnable',
      this.authenticationSetting.value.isLinkedInEnable
    );
    formData.append(
      'isGitHubEnable',
      this.authenticationSetting.value.isGitHubEnable
    );
    formData.append(
      'organisationDomain',
      this.Organisation.organisations.organisationDomain
    );
    formData.append(
      'selfRegistration',
      this.userPermission.value.enableSelfRegister
    );
    formData.append('activeDislike', this.userPermission.value.enableDislike);
    formData.append(
      'allowCustomTagging',
      this.userPermission.value.enableCustomTagging
    );
    if (this.imageToUpload)
      formData.append('ImageFile', this.imageToUpload, this.imageToUpload.name);
    else formData.append('ImageFile', '');
    this.loading = true;
    this._orgService
      .updateOrganisation(this.Organisation.organisations.id, formData)
      .subscribe(
        (res: any) => {
          this.loading = false;

          this._toastr.info('Organisation updated successfully', '', {
            timeOut: 3000,
          });
        },
        (error: any) => {
          this.loading = false;
        }
      );
  }
}
