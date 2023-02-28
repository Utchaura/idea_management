import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
} from '@angular/core';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IdeaService } from 'src/app/services/idea.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventManagementService } from 'src/app/services/event-management.service';

@Component({
  selector: 'app-approver-form',
  templateUrl: './approver-form.component.html',
  styleUrls: ['./approver-form.component.css'],
})
export class ApproverFormComponent implements OnInit {
  @Input() public idea_id: string;
  @Input() public idea_status: string;

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
  defaultimgpath: any;
  @Input() public index: number;

  @ViewChild('userInput') userInput: ElementRef;

  @ViewChild('autoUser') autoUser: MatAutocomplete;
  Ideaid: string;
  Idea: any;
  Approver: any;
  user: any;
  currentUserId: any;
  currentUserIsApprover: boolean = false;
  constUser: any;
  filterList: any;
  windowUrl: string;
  localUrl: string;
  prodUrl: string;

  constructor(
    public _userService: UserService,
    private _ideaService: IdeaService,
    private _orgService: OrganisationService,
    private _toastr: ToastrService,
    private _authservice: AuthService,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    private _route: Router,
    private _eventManagement: EventManagementService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
  }

  ngOnInit(): void {
    // http://democompany.poideamanagement.com:4200/organisation/idea-list
    this.windowUrl = window.location.href;
    this.localUrl = 'http://' + this._subdomain + '.poideamanagement.com:4200/organisation/idea-list';
    this.prodUrl = 'http://'+ this._subdomain +'.ideashub.io/organisation/idea-list'

    this.user = this._authservice.getUser();
    this.currentUserId = this.user.id;
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
        var data = {
          id: this.Ideaid,
          organisationDomain: this.organisationDomain,
        };
        this._ideaService.getIdeaById(data).subscribe(
          (res: any) => {
            this.Idea = res;

            this.Approver = this.Idea.ideas.approvers

        this.userName = this.Approver.map((user: any) => ({
          name: user.user.firstName + ' ' + user.user.lastName,
          id: user.user.id,
          image:
            user.user.userImage == null
              ? this.defaultimgpath
              : user.user.userImage.imageSrc,
        }));
        this.users = this.userName;
        this._userService.getAllApprover(this.organisationId).subscribe(
          (res) => {
            this.defaultimgpath = './../../../../../assets/admin.png';

            this.userList = res;
            this.userList = this.userList.approver;

            this.userName = this.userList.map((user: any) => ({
              name: user.firstName + ' ' + user.lastName,
              id: user.id,
              image:
                user.userImage == null
                  ? this.defaultimgpath
                  : user.userImage.imageSrc,
            }));

            this.allUsers = this.userName;
            this.usersList();

          },
          (error: any) => { }
        );

          },
          (err: any) => { }

        );

      }

    },
      (err) => { }
    );
  }




  usersList(){

    let userList = this.allUsers.filter((ar: { id: any; }) =>!this.users.find(rm=>rm.id===ar.id))
    this.filterList= userList.sort((a: { name: string; }, b: { name: any; }) =>
    a.name.localeCompare(b.name));

    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((user: string | null) =>
        user ? this._filterUser(user) : this.filterList.slice()
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

    //this.deleteIdeaApprover(user,this.idea_id);
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);

    }
    this.filterList.push(user);
    this.usersList();
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    let index =  this.users.indexOf(event.option.viewValue);
    const filteruser = this.filterList.indexOf(event.option.value);

    if(index === -1){
    this.users.push(event.option.value);
    }
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
    if(filteruser >=0)
    {
     this.filterList.splice(filteruser,1);
   }
   this.usersList();
  }

  private _filterUser(value: any): any[] {
    return this.filterList.filter(
      (user: { name: string }) =>
        user.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
    );
  }

  Save() {
    let formData = new FormData();
    formData.append('ideaId', this.idea_id);
    formData.append('organisationDomain', this.organisationDomain);
    for (let user of this.users) {
      if(user.id == this.currentUserId)
      this.currentUserIsApprover = true;
      formData.append('approversIds[]', user.id);
    }
  if(this.users<[1]){
    this._toastr.info('Please select atleast one approver.', '', {
      timeOut: 3000,
    });
  }
  else{
    this._ideaService.ApproveIdea(formData).subscribe(
      (res) => {
        this._toastr.info('Approver Added successfully', '', {
          timeOut: 3000,
        });
        this.modalService.dismissAll();
        // this._route.navigate(['/organisation/idea-main/under-approval-idea']);
        // let location = window.location.href;
        // let afterLastSlash = location.substring(location.lastIndexOf('/') + 1);
        if(this.currentUserIsApprover){
          // if(afterLastSlash == "my-input-idea"){
          //   var value = {
          //     ideaStatus: 'needmyInput',
          //     ideaType: this.idea_status
          //   }
          //   this._route.navigate(['/organisation/idea-main/my-input-idea']);
          // }
          const status = JSON.parse(localStorage.getItem('idea-status-title'));
          if(status == "Ideas Need Input"){
            var value = {
              ideaStatus: 'needmyInput',
              ideaType: this.idea_status
            }
            if(this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
            this._route.navigate(['/organisation/idea-main/my-input-idea']);
          }
          else{
            var value = {
              ideaStatus: '2.5',
              ideaType: this.idea_status
            }
            if(this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
            this._route.navigate(['/organisation/idea-main/under-approval-idea']);
          }
        }
        else{
          var value = {
            ideaStatus: '2',
            ideaType: this.idea_status
          }
          if(this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
        this._route.navigate(['/organisation/idea-main/under-approval-idea']);
        }
       // this.getIdeaById();
        this._ideaService.ideaCount(value);
        this._ideaService.ideaRecentlyUpdated(this.idea_id);
        this._ideaService.approverAdded(this.idea_id, this.index);
        var v = {
          ideaId: this.idea_id,
          index: this.index
        }
        this._eventManagement.reflectIdeaStatusChange(v);

      },
      (err) => { }
    );
  }
  }

  deleteIdeaApprover(user:any,idea_id:any) {
    var value = {
      Id: user.id,
      OrganidationDomain : this.organisationDomain,
      IdeaId: idea_id
    }
    let len = this.Approver.length;
    if(len!=0){

    for(let i = 0; i<len; i++){
      if(this.Approver[i].userId == user.id){
    this._ideaService.deleteIdeaApprover(value).subscribe((res) => {
      this._toastr.info('Approver has been successfully deleted', '', {
        timeOut: 3000,
      });
    });
  }
}
  }
}
}
