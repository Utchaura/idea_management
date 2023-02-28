import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { Location } from '@angular/common';
import { IdeaService } from 'src/app/services/idea.service';
import { forEach } from 'lodash';


@Component({
  selector: 'app-user-select-form',
  templateUrl: './user-select-form.component.html',
  styleUrls: ['./user-select-form.component.css']
})
export class UserSelectFormComponent implements OnInit {
  @Input() public idea_id: string;
  @Input() public privacy_value: string;
  @Input() public status: string;
  privacyValue: number;
  Organisation: any;
  organisationDomain: any;
  organisationId: any;
  userId: any;
  userList: any;
  userName: any[] = [];
  users: any[] = [];
  allUsers: any = [];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers: Observable<any[]>;
  @Input() public index: number;
  @ViewChild('userInput') userInput: ElementRef;

  @ViewChild('autoUser') autoUser: MatAutocomplete;
  Ideaid: string;
  Idea: any;
  defaultimgpath: any;
  PublishedUser: any[];
  List: any[];
  getUSer:any[] = [];
  filterUserList: any[];
  constUser: any;
  usersName: any;
  filterList: any;
  windowUrl: string;
  localUrl: string;
  prodUrl: string;

  constructor(
    public _userService: UserService,
    private _ideaService: IdeaService,
    private _orgService: OrganisationService,
    private _toastr: ToastrService,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    private _route: Router,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {


}

  ngOnInit(): void {
    this.windowUrl = window.location.href;
    this.localUrl = 'http://' + this._subdomain + '.poideamanagement.com:4200/organisation/idea-list';
    this.prodUrl = 'http://'+ this._subdomain +'.ideashub.io/organisation/idea-list'
    if(this.privacy_value === "SelectedUsers")
    this.privacyValue = 2
    if(this.privacy_value === "ExceptUsers")
    this.privacyValue = 3

    this.Ideaid = this.idea_id;
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
        if (this.idea_id) {
          var data  = {
            id: this.idea_id,
            organisationDomain: this._subdomain
          }
          this._ideaService.getIdeaById(data).subscribe((res: any) => {
            this.Idea = res;
            let privacy = this.Idea.ideas.privacy;
            this.PublishedUser = this.Idea.ideas.publishedUsers
            this.userName = this.PublishedUser.map((user: any) => ({
              name: user.user.firstName + ' ' + user.user.lastName,
              id: user.user.id,
              image:
                user.user.userImage == null
                  ? this.defaultimgpath
                  : user.user.userImage.imageSrc,
            }));
            if(this.privacyValue === privacy){
              this.users = this.userName;


            }
            this._userService.getAllUser(this.organisationId, false).subscribe(
              (res: any) => {
                this.defaultimgpath = './../../../../../assets/admin.png';
                this.userList = res;
                this.userList = this.userList.users;
                this.userName = this.userList.map((user: any) => ({
                  name: user.firstName + ' ' + user.lastName,
                  id: user.id,
                  image:
                    user.userImage == null
                      ? this.defaultimgpath
                      : user.userImage.imageSrc,
                }));
                this.allUsers = this.userName;

                this.userlist()

              },
              (error: any) => { }
            )

          })
        }
     },
      (err) => { }
    );


  }

  userlist()
  {
    this.filterList= this.allUsers.filter((ar: { id: any; }) =>!this.users.find(rm=>rm.id===ar.id))
    this.filterUserList=this.filterList.sort((a: { name: string; }, b: { name: any; }) =>
       a.name.localeCompare(b.name));

     this.filteredUsers = this.userCtrl.valueChanges.pipe(
       startWith(''),
       map((user: string | null) =>
         user ? this._filterUser(user) : this.filterUserList.slice()
       )
     );
  }

  addUser(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if(this.allUsers.indexOf(value) !== -1){
      // Add our users

      if ((value || '').trim()) {
        if (!this.allUsers.includes(value.trim())) {
        this.users.push({
          id: Math.random(),
          name: value.trim(),
        });
      }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.userCtrl.setValue(null);
  }

  removeUser(user: string): void {

    // this.deleteIdeaPublishedUser(user,this.idea_id);
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
    this.filterUserList.push(user);
   this.userlist();

  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    let index =  this.users.indexOf(event.option.viewValue);

    const filteruser = this.filterUserList.indexOf(event.option.value);


    if(index === -1){
    this.users.push(event.option.value);
    }
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
    if(filteruser >=0)
    {
     this.filterUserList.splice(filteruser,1);
   }
   this.userlist();
  }

  private _filterUser(value: any): any[] {

    return this.filterUserList.filter(
      (user: { name: string }) =>
       user.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
    );
  }

  Save() {
    let formData = new FormData();
    formData.append('ideaId', this.idea_id);
    formData.append('organisationDomain', this.organisationDomain);
    formData.append('status', this.status);
    switch (this.privacy_value) {
      case 'Public':
        formData.append('privacy', '0');
        break;
      case 'SelectedUsers':
        formData.append('privacy', '2');
        break;
      default:
        formData.append('privacy', '3');
        break;
    }
    for   (let user of this.users) {
      formData.append('publishedUsersIds[]', user.id);
    }
      if(this.users<[1]){
        this._toastr.info('Please select atleast one user.', '', {
          timeOut: 3000,
        });
    }else {
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
        //this.getIdeaById();
        this._ideaService.ideaCount(value);
        this._ideaService.ideaRecentlyUpdated(this.idea_id);
        this._ideaService.ideaUpdate(this.idea_id, this.index);
        },
        (err) => { }
      );
    }
  }

  deleteIdeaPublishedUser(user:any,idea_id:any) {
       var value = {
      Id: user.id,
      OrganidationDomain : this.organisationDomain,
      IdeaId: idea_id
    }
    let len = this.PublishedUser.length;
    if(len!=0){

    for(let i = 0; i<len; i++){
      if(this.PublishedUser[i].userId == user.id){
        this._ideaService.deleteIdeaPublishedUser(value).subscribe((res) => {
          this._toastr.info('Published User has been successfully deleted', '', {
            timeOut: 3000,
          });
        });
      }
    }
  }

}
}
