import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/services/notification.Service';
import { IdeaService } from 'src/app/shared/idea.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import{Notification } from '../../models/notification-model';
import * as signalR from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';
import { Console } from 'node:console';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  providers: [DatePipe]
})
export class NotificationComponent implements OnInit {

  dropdown:boolean =false;
  notificationList: any;
  id: any;

  private notificationsSubject$ = new Subject<Notification[]>();
  sNotification: void;
  notifications$ = this.getNotifications();
  notificationId: Object;
  userId: any;
  constructor(
    public datepipe: DatePipe,
    public _notificationservice: NotificationService,
    private _route: Router,
    private _ideaService: IdeaService,
    private _toastr: ToastrService,
    public _authservice: AuthService,

    private elementRef: ElementRef,
    private http : HttpClient,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {
    const user = this._authservice.getUser();
    this.userId = user.id;
  //   this.getallNotification();
  //   const connection = new signalR.HubConnectionBuilder()
  //   .configureLogging(signalR.LogLevel.Debug)
  //   .withUrl('http://localhost:3008/broadcastHub',{withCredentials: false,skipNegotiation: true,
  //   transport: signalR.HttpTransportType.WebSockets
  //     })
  //   .build();

  // connection.start().then(function () {
  // }).catch(function (err) {
  //   return console.error(err.toString());
  // });


  // connection.serverTimeoutInMilliseconds = 100000; // 100 second
  // connection.on("BroadcastMessage", () => {
  //   this.getallNotification();
  // });

    // this._notificationservice.GetAllNotification().subscribe(
    //   (res: Notification[])=>{
    //     this.notificationList = res;
    //     this.notificationList =this.notificationList.notifications;

    //   },
    //   (err:any) => {}

    // );



 this.getNotifications()

}
   getNotifications(){

    this._notificationservice.GetAllNotification().subscribe(
      (res: Notification[])=>{
        this.notificationList = res;
        this.notificationList =this.notificationList.notifications;

        // this.sNotification= this.notificationList
        //  this.sortByDate(this.notificationList);
       },

    (err:any) => {}

  );
   }

   deleteNotification(i:Notification, index: number){
    let formData = new FormData();
    formData.append('Id', i.id);

    this._notificationservice.DeleteNotification(formData).subscribe(res=>
      {
      this.notificationList.splice(index, 1);
      this._toastr.info('notification deleted successfully', '', {
        timeOut: 3000,
      });
      this._notificationservice.notificationsCount();

    }
    )

  }

  clearNotification(){

    let formData =new FormData();
    formData.append('RecipientId',this.userId);
    this._notificationservice.ClearNotification(formData).subscribe(res=>{
      this._toastr.info('All notifications deleted successfully', '', {
        timeOut: 3000,
      });
      this._notificationservice.notificationsCount();
    })

  }
 private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }



sortByDate(notification:Notification[]){
  notification.sort((a,b)=>{
   return this.getTime(new Date(a.created_on)) - this.getTime(new Date(b.created_on));
 //return this.calculateDiff(a.created_on)- this.calculateDiff(b.created_on);
  })
}

  calculateDiff(dataDate:any)
  {

    let start = moment().format('DD/MM/YYYY HH:mm:ss');
    let then = moment.utc(dataDate.created_on).toDate();
   let now = moment(then).local().format('DD/MM/YYYY HH:mm:ss');
    let time = Math.abs(moment(start,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss")));
    let latest= moment(then).local().format('DD-MM-YYYY HH:mm a');
    let diffDay = Math.floor(time / 86400000);  //day calculated
    let diffHour = Math.floor((time % 86400000)/3600000);//hour calculated
   let diffMin =  Math.floor(((time % 86400000)% 3600000) /60000);// minutes calculated
   let diffSec =  Math.floor(((time % 86400000)%60000)/10000);// seconds calculated


   if(diffHour >=24)
   {
     return latest
   }
    else if (diffHour<1) {
      return diffMin
    }
    else {
      return diffHour
    }
  }

  hourTime(key:any)
  {
    let start = moment().format('DD/MM/YYYY HH:mm:ss');
    let then = moment.utc(key.created_on).toDate();
    let now = moment(then).local().format('DD/MM/YYYY HH:mm:ss');
    let time = Math.abs(moment(start,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss")));

    let diffDay = Math.floor(time / 86400000);  //day calculated
    let diffHour = Math.floor((time % 86400000)/3600000);//hour calculated
   let diffMin =  Math.floor(((time % 86400000)% 3600000) /60000)// minutes calculated


  if(diffHour >=24)
 {
   return  ''
  }
  else if(diffHour <1)
  {

    return "min ago"
  }
  else
      return "Hour ago"
 }




IdeaProfile(i:Notification) {

this.id =i.ideaId;
  this._route.navigateByUrl(
    '/organisation/idea-main-details-page?id=' +
      this.id +
        '&OrganisationDomain=' +
        this._subdomain

  );
}
 DropDownOpen()
  {
    this.dropdown =true;
  }
  DropDownClose()
  {
    this.dropdown =false;
  }
}

