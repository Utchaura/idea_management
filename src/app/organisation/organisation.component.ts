import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganisationService } from '../shared/organisation.service';
import { SUB_DOMAIN } from '../shared/subdomain.token';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IdeaService } from '../services/idea.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user-model';
import { NotificationService } from '../services/notification.Service';
import { Notification } from '../models/notification-model';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { indexOf } from 'lodash';
@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css'],
})
export class OrganisationComponent implements OnInit {
  helper = new JwtHelperService();
  profilePic = './../../assets/admin.png';
  userlist: any;
  profile: boolean = false;
  OrganisationName: any;
  Website: any;
  email: any;
  id: any;
  showInputSearch: boolean = false;

  userId: '';
  organisationDomain: '';
  users: any;
  organisationLogo: string;
  Ideaform: boolean = false;
  freshIdeaTitle = true;
  searchKey: string;
  notification: boolean = false;
  notificationList: any;
  notificationCountresult: string;
  notificationCount: number;
  roles: any;
  displayCog: boolean = false;
  role: any;
  orgDisplay: boolean = false;
  ideaStatus: string;
  connector: boolean;

  constructor(
    public _orgService: OrganisationService,
    public _notificationservice: NotificationService,
    public _userService: UserService,
    private _route: Router,
    private _ideaService: IdeaService,
    public _authservice: AuthService,
    @Inject(SUB_DOMAIN) private _subdomain: string,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this._ideaService.HashClickEvent.subscribe((key) => {
      this.showInputSearch = true;
      this.searchKey = '#' + key;
    });
    this._ideaService.listen().subscribe((res)=>{
      this.notificationCountResult();
    })
    this._ideaService.listenkey().subscribe((res)=>{
      this.notificationCountResult();
    })
    this._notificationservice.getNotificationSCount().subscribe((res)=>{

      this.notificationCountResult();
    })
    this._ideaService.getNotificationCount().subscribe((res) => {

      this.notificationCountResult();
    });
    this._userService.refreshCurrentUser().subscribe((res) => {
      this.getCurrentUser();
    });

    this._ideaService.GetIdeasStatusTitle().subscribe((res) => {
      this.ideaStatus = res;
    });
  }
  ngOnInit(): void {
    const status = JSON.parse(localStorage.getItem('idea-status-title'));
    if (status) {
      this.ideaStatus = status;
    }

    // let windowUrl = window.location.href;
    // var url = 'http://'+ this._subdomain + '.poideamanagement.com:4200/organisation/idea-main/fresh-idea'

    //this.notificationCountResult();
    //  const connection = new signalR.HubConnectionBuilder()
    //         .configureLogging(signalR.LogLevel.Debug)
    //         .withUrl('http://localhost:3008/broadcastHub',{withCredentials: false,skipNegotiation: true,
    //         transport: signalR.HttpTransportType.WebSockets
    //           })
    //         .build();

    //       connection.start().then(function () {

    //       }).catch(function (err) {
    //         return console.error(err.toString());
    //       });

    //       connection.on("SendMessage", (result) => {

    //        this.notificationCountResult();

    // });

    //    },

    //    (err:any) => {}

    //  );
    //       });

    this.notificationCountResult();

    const user = this._authservice.getUser();
    this.email = user.Email;
    this.id = user.id;
    this.userId = user.id;
    this.role = user.Roles;
    this.roles = this.role.split('|');
    if (
      this.roles.includes('Admin') ||
      this.roles.includes('Moderator') ||
      this.roles.includes('Approver')
    ) {
      this.displayCog = true;
      if (this.roles.includes('Admin')) {
        this.orgDisplay = true;
      }

      if (this.roles.includes('Approver')) {
        this.connector = true;
      }
    }

    if (this._subdomain.toUpperCase() == 'WWW') {
    } else {
      this._orgService.checkIfDomainExist(this._subdomain).subscribe(
        (res) => {
          this.OrganisationName = res;
          this.organisationDomain =
            this.OrganisationName.organisations.organisationDomain;
          this.organisationLogo = this.OrganisationName.organisations.organizationLogo ?
            this.OrganisationName.organisations.organizationLogo.imageSrc +
            '?' +
            Math.floor(1000000000 + Math.random() * 9000000000) : null;


          this.getCurrentUser();

          this.OrganisationName =
            this.OrganisationName.organisations.organisationName.toUpperCase();
          this.Website = res;
          this.Website = this.Website.organisations.website.toLowerCase();
        },
        (error) => {}
      );
    }
  }

  getCurrentUser() {
    var localuser = new User();
    localuser.Id = this.id;
    localuser.OrganisationDomain = this.organisationDomain;
    this._userService.getUserById(localuser).subscribe(
      (res) => {
        this.users = res;
        if (this.users.users.userImage) {
          this.profilePic =
            this.users.users.userImage.imageSrc +
            '?' +
            Math.floor(1000000000 + Math.random() * 9000000000);
        } else this.profilePic;
      },
      (error) => {}
    );
  }

  notificationCountResult() {
    this._notificationservice.GetAllNotification().subscribe(
      (res: Notification[]) => {
        this.notificationList = res;
        this.notificationList = this.notificationList.notifications;
        this.notificationList = this.notificationList.filter(
          (notification: { processed: boolean }) => !notification.processed
        );
        if(this.notificationList.length > 10)
        this.notificationCountresult = "10+"
        else
        this.notificationCountresult = this.notificationList.length;

      },

      (err: any) => {}
    );
  }

  UserProfile() {
    this._ideaService.ideaStatusTitle('My Profile');
    // this._route.navigateByUrl(
    //   '/organisation/userdetail?id=' +
    //     this.id +
    //     '&OrganisationDomain=' +
    //     this.organisationDomain
    // );
    this._route.navigate(['/organisation/userdetail', this.id]);
  }

  ShowIdeaForm(formContent: any) {
    this.modalService.open(formContent, { size: 'lg', backdrop: 'static' });
    this.showInputSearch = false;
    this.searchKey = '';
  }

  showIdeaTitle() {
    this._ideaService.ideaStatusTitle('Fresh Ideas');
    this.freshIdeaTitle = true;
    this.showInputSearch = false;
    this.searchKey = '';
    this._ideaService.filterIdea(this.searchKey);
  }
  hideIdeaTitle() {
    this.freshIdeaTitle = false;
    this.showInputSearch = false;
    this.searchKey = '';
    this._ideaService.filterIdea(this.searchKey);
  }
  enableGridView() {
    this.freshIdeaTitle = false;
    this.showInputSearch = false;
    this.searchKey = '';
    this._ideaService.filterIdea(this.searchKey);
  }

  toggleTag() {
    this.showInputSearch = !this.showInputSearch;
  }

  userprofile() {
    this.profile = true;
  }

  pic() {
    this.profile = false;
  }

  SearchIdeaGlobally() {
    if (this.searchKey.startsWith('#', 0)) {
      this.searchKey = this.searchKey.substring(1);
    }
    this._ideaService.filterIdea(this.searchKey);
    // this._route.navigate(['/organisation/idea-search']);
  }
  NotificationModal() {
    this.notification = !this.notification;
  }
  Notification(e:any) {
    if(e.target.className == 'fas fa-times'){
    this.notification = true;
    }
    else{
      this.notification = false;
    }
  }
}
