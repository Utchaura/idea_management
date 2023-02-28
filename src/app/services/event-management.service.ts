import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EventManagementService {

  public ideaStatusChange = new Subject<any>();

  constructor() { }

  reflectIdeaStatusChange(data: any) {
    this.ideaStatusChange.next(data);
  }
}
