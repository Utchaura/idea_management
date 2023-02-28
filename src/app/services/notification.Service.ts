import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscriber } from 'rxjs/internal/Subscriber';
import {Notification} from '../models/notification-model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })

  export class NotificationService{
      notification:Notification;
      onEventTrigger: EventEmitter<any> = new EventEmitter();

      constructor(private http: HttpClient) {}

      private _listeners = new Subject<any>();

      GetAllNotification(): Observable<Notification[]>
      {
        return this.http.get<Notification[]>(
          environment.notificationUrl  +
          'NotificationService/GetAllNotification'
        );
      }
      DeleteNotification(value: any) {
        return this.http.put(
          environment.notificationUrl + 'NotificationService/DeleteNotification',
         value
        );
      }
      notificationsCount() {
        this._listeners.next();
      }
   getNotificationSCount(): Observable<any> {
    return this._listeners.asObservable();
   }

     ClearNotification(value:any){
        return this.http.put(
          environment.notificationUrl + 'NotificationService/DeleteAllNotification',
            value
            );
     }
  }
