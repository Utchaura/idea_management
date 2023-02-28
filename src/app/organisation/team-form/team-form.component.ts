import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
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
import { debug } from 'node:console';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css'],
})
export class TeamFormComponent implements OnInit {
  @Input() public team_id: any;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  teamCtrl = new FormControl();
  filteredTeams: Observable<any[]>;
  teams: any[] = [];
  tags: string[];
  // allTeams: string[] = [];
  allTeams: any = [];
  //teamtags: string[] = [];
  userName: any[] = [];
  userList: any;
  organisationDomain: any;
  teamUsers: any[];

  @ViewChild('teamInput') teamInput: ElementRef;

  @ViewChild('autoTeam') autoTeam: MatAutocomplete;

  teamCreateForm = new FormGroup({
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    teamtags: new FormControl(''),
  });
  Organisation: any;
  OrganisationId: any;
  teamres: any;
  teamlist: any;
  team: any;
  teamUserList: any;

  constructor(
    public _orgService: OrganisationService,
    private _route: Router,
    public _userService: UserService,
    private modalService: NgbModal,
    public _location: Location,
    private _toastr: ToastrService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {

  }

  ngOnInit(): void {
    if(this.team_id){
      this.teamCreateForm = new FormGroup({
        code: new FormControl({ value: '', disabled: true }, Validators.required),
        description: new FormControl('', Validators.required),
        teamtags: new FormControl(''),
      });


    }



    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.OrganisationId = this.Organisation.organisations.id;
        this.organisationDomain =
          this.Organisation.organisations.organisationDomain;
          if(!this.team_id){
            this.getUserByRoles();
          }
          else{
          this._orgService.getTeamById(this.team_id).subscribe(
            (res: any) => {
            this.team = res;
            this.teamUsers = this.team.team.teamUsers;
            this.userName = this.teamUsers.map((user: any) => ({
              name: user.user.firstName + ' ' + user.user.lastName,
              id: user.user.id,
            }));
            this.teams = this.userName;
            this.teamCreateForm = new FormGroup({
              code: new FormControl(this.team.team.code),
              description: new FormControl(this.team.team.description),
            });
            this._userService.getUsersByRoles(this.OrganisationId).subscribe(
              (res: any) => {

                this.userList = res;
                  this.userList = this.userList.users;
                  this.userName = this.userList.map((user: any) => ({
                    name: user.firstName + ' ' + user.lastName,
                    id: user.id,
                  }));

                this.allTeams = this.userName;
                this.teamList();

              },
              (error: any) => {}
            );
            },
            (err: any) => {}
          );
          }

      },
      (error: any) => {}
    );


  }


  getUserByRoles(){
    this._userService.getUsersByRoles(this.OrganisationId).subscribe(
      (res: any) => {

        this.userList = res;
          this.userList = this.userList.users;
          this.userName = this.userList.map((user: any) => ({
            name: user.firstName + ' ' + user.lastName,
            id: user.id,
          }));

        this.allTeams = this.userName;
        this.teamList();
      },
      (error: any) => {}
    );
  }

  teamList(){
    let filterUserList= this.allTeams.filter((ar: { id: any; }) =>!this.teams.find(rm=>rm.id===ar.id))
    this.teamUserList= filterUserList.sort((a: { name: string; }, b: { name: any; }) =>
       a.name.localeCompare(b.name));
    this.filteredTeams = this.teamCtrl.valueChanges.pipe(
      startWith(''),
      map((team: string | null) =>
        team ? this._filterTeam(team) : this.teamUserList.slice()
      )
    );
  }
  addTeam(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if(this.allTeams.indexOf(value) !== -1){
     // Add our skill

      if ((value || '').trim()) {
        if (!this.allTeams.includes(value.trim())) {
        this.teams.push({
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

    this.teamCtrl.setValue(null);
  }

  removeTeam(team: string): void {
    const index = this.teams.indexOf(team);

    if (index >= 0) {
      this.teams.splice(index, 1);
    }
    this.teamUserList.push(team);
    this.teamList();
  }

  selectedTeam(event: MatAutocompleteSelectedEvent): void {

    let index =  this.teams.indexOf(event.option.viewValue);
    const filteruser =  this.teamUserList.indexOf(event.option.value);

    if(index === -1){
    this.teams.push(event.option.value);
    }
    this.teamInput.nativeElement.value = '';
    this.teamCtrl.setValue(null);
    if(filteruser >=0)
    {
      this.teamUserList.splice(filteruser,1);
   }
   this.teamList();
  }

  private _filterTeam(value: any): any[] {
    return this.teamUserList.filter(
      (team: { name: string }) =>
        team.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
    );
  }

  onSubmit() {

    if (this.team_id) {
      let formData = new FormData();
      formData.append('Code', this.teamCreateForm.value.code);
      formData.append('Id', this.team_id);
      formData.append('Description', this.teamCreateForm.value.description);
      formData.append('OrganisationId', this.OrganisationId);
      for (let team of this.teams) {
        formData.append('teamUsers[]', team.id);
      }
      this._orgService.updateTeam(this.team_id, formData).subscribe(
        (res: any) => {
          this._toastr.success('Team  updated  successfully', '', {
            timeOut: 3000,
          });
          this.modalService.dismissAll();
          this.teamCreateForm.reset();
          this._orgService.filter('Update click');

        },

        (error: { error: { ErrorMessage: string } }) => {}

      );
    } else {
      let formData = new FormData();
      formData.append('Code', this.teamCreateForm.value.code);
      formData.append('Description', this.teamCreateForm.value.description);
      formData.append('OrganisationId', this.OrganisationId);
      for (let team of this.teams) {
        formData.append('teamUsers[]', team.id);
      }

      this._orgService.createTeam(formData).subscribe(
        (res: any) => {
          this._toastr.success('Team  created successfully', '', {
            timeOut: 3000,
          });
          this.modalService.dismissAll();
          this.teamCreateForm.reset();
          this._orgService.filter('Update click');

        },
        (error: { error: { ErrorMessage: string } }) => {}
      );

    }
  }
}
