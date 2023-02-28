import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from './user.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

interface userInterface {
  firstName:string,
  lastName:string,
  id:'',
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  [x: string]: any;
  user:User={
    id:'',
    firstName: '',
    lastName: '',
    orgID: '',
    orgName: '',
    active: false,
    emailId: '',
    mobileNo: '',
    imageDataBase64: '',
    roles:[],
    permissions:[],
    organisationDomain:'',
  }

  constructor(private http: HttpClient, private _router: Router) {}

  private _listeners = new Subject<any>();

  getAllUser(id: string): Observable<User> {
    return this.http.get<User>(
      environment.apiUserUrl +
        'AccountService/GetAllUser?OrgId=' +
        id
    );
  }
  getUsersByRoles(id: string): Observable<User> {

    return this.http.get<User>(
      environment.apiUserUrl +
        'AccountService/GetUsersByRoles?OrgId=' +
        id
    );
  }
  getUserById(value: any) {
    return this.http.get(
      environment.apiUserUrl +
        'AccountService/GetByIdUser?Id=' +
        value.id +
        '&OrganisationDomain=' +
        value.organisationDomain
    );
  }
  getUpdatedCoverImage(): Observable<any> {
    return this._listeners.asObservable();
  }


  coverImageUpdate(value:any)
  {
    this._listeners.next(value);
  }

  getAllUserName(domain: any): Observable<string[]> {
    return this.http.get<{[users:string]:userInterface[]}>(
      environment.apiUserUrl +
        'AccountService/GetAllUser?OrganisationDomain=' +
        domain
    ).pipe(map((resp) => resp.users.map((e:userInterface) =>
    e.firstName + '' + e.lastName + '' + e.id)));
  }


  updateUser(user: any) {
    return this.http.put(
      environment.apiUserUrl + 'AccountService/UpdateUser',
      user
    );
  }

  deleteUser(user: any) {
    return this.http.delete(
      environment.apiUserUrl + 'AccountService/DeleteUser/'+user.id + '?Id='+user.id + '&OrganisationDomain='+user.organisationDomain
    );
  }
  uploadUserCoverImage(user: any){
   return this.http.put(
     environment.apiUserUrl + 'AccountService/ChangeUserCoverImage',
     user
   )
  }

  changePassword(user: any){
    return this.http.put(
      environment.apiUserUrl + 'AccountService/ChangePassword',
      user
    )
  }

  getToken() {
    return localStorage.getItem('token');
  }

  createUser(user: FormData) {
    return this.http.post(
      environment.apiUserUrl + 'AccountService/CreateUser',
      user
    );
  }
}
