import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';
import { MatRadioModule } from '@angular/material/radio';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-privacy-form',
  templateUrl: './privacy-form.component.html',
  styleUrls: ['./privacy-form.component.css'],
})
export class PrivacyFormComponent implements OnInit {
  @Input() public idea_id: string;
  @Input() public privacy_value: string;
  @Input() public status: string;
  @Input() public index: number;


  helper = new JwtHelperService();
  userId: any;
  emailId: any;
  Organisation: any;
  organisationDomain: any;
  organisationId: any;
  users: any;
  profilePic: any;
  userName: string;
  firstName: any;
  userEmail: any;
  privacyvalue: any;
  privacyVal: any;

  PrivacyForm = new FormGroup({
    privacy: new FormControl(''),
  });
  Ideaid: string;
  Idea: any;
  roles: any;
  defaultDisplay: boolean = true;
  privacy: any;
  windowUrl: string;
  localUrl: string;
  prodUrl: string;






  constructor(
    public _orgService: OrganisationService,
    private _route: Router,
    public _userService: UserService,
    private _ideaService: IdeaService,
    private _toastr: ToastrService,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) { }

  ngOnInit(): void {
    this.windowUrl = window.location.href;
    this.localUrl = 'http://' + this._subdomain + '.poideamanagement.com:4200/organisation/idea-list';
    this.prodUrl = 'http://'+ this._subdomain +'.ideashub.io/organisation/idea-list'

    this.Ideaid = this.idea_id;

    const me = this;
    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    this.userId = decodedToken.id;
    this.emailId = decodedToken.Email;
    this.roles = decodedToken.Roles;

    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.organisationDomain =
          this.Organisation.organisations.organisationDomain;
        this.organisationId = this.Organisation.organisations.id;
        var value = {
          id: this.userId,
          organisationDomain: this.organisationDomain,
        };
        this._userService.getUserById(value).subscribe(
          (res) => {
            this.users = res;
            this.firstName = this.users.users.firstName;
            var lastName = this.users.users.lastName;
            this.userEmail = this.users.users.emailId;
            this.userName = this.firstName + ' ' + lastName;
            if (this.users.users.userImage)
              this.profilePic = this.users.users.userImage.imageSrc;
            else this.profilePic = '';
          },
          (err) => { }
        );

        if (this.roles == 'UnlicensedUser') {
          this.defaultDisplay = false;
        }
        var data = {
          id: this.Ideaid,
          organisationDomain: this.organisationDomain,
        };
        this._ideaService.getIdeaById(data).subscribe(
          (res: any) => {

            this.Idea = res;

               this.privacy = this.Idea.ideas.privacy;
              this.status = this.Idea.ideas.status;



              if (this.Idea.ideas.status == 4 || this.Idea.ideas.status == 1 || this.Idea.ideas.status == 2 ||this.Idea.ideas.status ==6 ) {
                var privacy = this.Idea.ideas.privacy;
                switch (privacy) {
                  case 0:
                    this.privacyVal = 'Public';
                    break;
                  case 2:
                    this.privacyVal = 'SelectedUsers';

                    break;
                  case 3:
                    this.privacyVal = 'ExceptUsers';
                }
              }

          },
          (err: any) => { }
        );
      },
      (error) => { }
    );
  }


  onItemChange(e: any) {
    this.privacyvalue = e.target.value;
  }

  Save() {
    let formData = new FormData();

    formData.append('ideaId', this.idea_id);
    formData.append('organisationDomain', this.organisationDomain);
    formData.append('status',this.status);
    switch (this.privacyvalue) {
      case 'Public':
        formData.append('privacy', '0');
        break;
      case 'SelectedUsers':
        formData.append('privacy', '2');
        break;
      case 'exceptUsers':
        formData.append('privacy', '3');
        break;
      default:
          formData.append('privacy',this.privacy);
       break;
    }
    this._ideaService.publishIdea(formData).subscribe(
      (res) => {
        this._toastr.info('Idea Published successfully', '', {
          timeOut: 3000,
        });
        this.modalService.dismissAll();

        if(this.status == '0'){
          if(this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
          this._route.navigate(['/organisation/idea-main/fresh-idea']);
          var value = {
            ideaStatus: '4',
            ideaType: this.status
          }
        }
          else{
            var value = {
              ideaStatus: this.status,
              ideaType: this.status
          }
        }
          this._ideaService.ideaCount(value);
         this._ideaService.ideaRecentlyUpdated(this.idea_id);
        this._ideaService.ideaUpdate(this.idea_id, this.index);
      },
      (err) => { }
    );
  }

  selectUsers(formContent: any) {
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }


}
