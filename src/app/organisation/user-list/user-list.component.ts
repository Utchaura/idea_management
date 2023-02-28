import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { OrganisationService } from 'src/app/services/organisation.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {


  userlist: any;
  OrganisationDomain: any;
 // checkBoxesMode: string;
  id: any;
  // firstName: any;
  // lastName: any;
  // mobileNo: any;
  // emailId: any;
  User_Id: any;
  organisation: any;
  organisationId: any;

  constructor(
    private _userService: UserService,
    private orgService: OrganisationService,
    private _route: Router,
    private _toastr:ToastrService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) { }
  //this.checkBoxesMode = 'onClick';

  ngOnInit(): void {
    if (this._subdomain.toUpperCase() == 'WWW') {
      this._route.navigate(['/']);
    } else {
      this.orgService.checkIfDomainExist(this._subdomain).subscribe(
        (res: any) => {
          var Organisation = res;
          this.OrganisationDomain = Organisation.organisations.organisationDomain;
          this.organisationId = Organisation.organisations.id;
          this._userService.getAllUser(this.organisationId, true).subscribe(
            (res: any) => {
              this.userlist = res;
              this.userlist = this.userlist.users;
            },
            (error: any) => {
            }
          );
        },
        (error: any) => {
        }
      );
    }
  }

  CreateUser()
  {
    // this._route.navigateByUrl('/organisation/editUser/generalform')
    this._route.navigateByUrl('/organisation/add-user/user')

  }

  onEdit(event:any){
    this.User_Id = event.data.id;
    this._route.navigateByUrl('/organisation/update-user/user?id='+event.data.id +'&OrganisationDomain='+this.OrganisationDomain)
  }



  onSaving(event:any){
    let user = new User();
    user.Id = event?.changes[0].key.id;
    user.OrganisationDomain =this.OrganisationDomain;

    // user = { ...event?.changes[0].data,
    //    id:event?.changes[0].key.id,
    //    organisationDomain:this.OrganisationDomain}

        this._userService.deleteUser(user).subscribe(response=>
          {
            this._toastr.success('User deleted successfully', '', {
              timeOut: 3000,
            });
          },(error=>
           {
           }
           )
         );
    }
  }
