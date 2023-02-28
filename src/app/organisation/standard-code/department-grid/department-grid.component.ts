import {Component,Inject,OnInit,ViewChild } from '@angular/core';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { ToastrService } from 'ngx-toastr';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent,MatAutocomplete,} from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/user.service';
import { ElementRef } from '@angular/core';
import{Teams} from 'src/app/models/teams-model';
import { TeamsService } from 'src/app/services/teams.service';


@Component({
  selector: 'app-department-grid',
  templateUrl: './department-grid.component.html',
  styleUrls: ['./department-grid.component.css'],
})
export class DepartmentGridComponent implements OnInit {

  
  teamlist: any;
  OrganisationId: any;
  Organisation: any;
 
  Teamid: any;
  teamres: any;
  organisationDomain: any;
  OrganisationTeamUsers:string [] = [];
 


  constructor(
    private orgService: OrganisationService,
    private _teams:TeamsService,
    private _toastr: ToastrService,
    private _route: Router,
    private modalService: NgbModal,
    public _userService: UserService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    this.orgService.listen().subscribe((m:any) => {
      this.refreshTeamList();
    })

  }
 

  ngOnInit(): void {
   
    this.orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.OrganisationId = this.Organisation.organisations.id;
        this.organisationDomain = this.Organisation.organisations.organisationDomain;
        this.refreshTeamList();
    
      },
      (error) => {}
    );
  }

  refreshTeamList(){
   
    this._teams.getAllTeam(this.OrganisationId).subscribe(
      (res: any) => { 
        this.teamlist=res;
         this.teamlist = this.teamlist.teams;
    
         this.teamlist.forEach((element:any,index : number) => {
          let fullName :Array<string> = [];
           let teamUsers = element.teamUsers;
           teamUsers.forEach((element:any)=> {
             var fName = element.user.firstName;
             var  lName = element.user.lastName;
             fullName.push(fName +" "+ lName);
            
         });
         this.teamlist[index]['OrganisationTeamUsers'] = fullName.join();
         fullName =[];
       
           });

     
      },
      (error: any) => {}
    )
  }

  ShowTeamForm(formContent: any) {
    
    this.Teamid = ''
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  
  onDeleting(event:any){
  
    var value ={
      Id:event.key.id,
      OrganisationDomain :this.organisationDomain

    }
    this.orgService.deleteTeam(value).subscribe(response=>
      {
        this._toastr.success('Team deleted successfully', '', {
          timeOut: 3000,
        });
      },(error=>
       {
       }
       )
     );
  }


  onEdit(event:any,formContent:any){
 
    this.modalService.open(formContent, { size: 'md',backdrop:'static', });
    this.Teamid=event.data.id
  }

  modalClose() {
    this.refreshTeamList();
  }

}
