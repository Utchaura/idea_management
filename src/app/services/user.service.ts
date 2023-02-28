import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';

interface userInterface {
  firstName: string;
  lastName: string;
  id: '';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User;
  currentUser: User;
  constructor(private http: HttpClient) {}

  private _listeners = new Subject<any>();

  refreshCurrentUser(): Observable<any> {
    return this._listeners.asObservable();
  }

  refreshUser(){
    this._listeners.next();
  }

  createUser(formData: FormData): Observable<User> {
    return this.http.post<User>(
      environment.apiUserUrl + 'AccountService/CreateUser',
      formData
    );
  }

  updateUser(user: any): Observable<User> {
    return this.http.put<User>(
      environment.apiUserUrl + 'AccountService/UpdateUser',
      user
    );
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete<User>(
      environment.apiUserUrl +
        'AccountService/DeleteUser/' +
        user.Id +
        '?Id=' +
        user.Id +
        '&OrganisationDomain=' +
        user.OrganisationDomain

    );
  }
  getUpdatedCoverImage(): Observable<any> {
    return this._listeners.asObservable();
  }


  coverImageUpdate(value:any)
  {
    this._listeners.next(value);
  }

  // http://localhost:3005/AccountService/GetAllUser?OrgId=121&UserList=true
  getAllUser(id: string, list: boolean): Observable<User> {
    return this.http.get<User>(
      environment.apiUserUrl + 'AccountService/GetAllUser?OrgId=' + id + "&UserList=" + list
    );
  }

  getUsersByRoles(id: string): Observable<User> {

    return this.http.get<User>(
      environment.apiUserUrl +
        'AccountService/GetUsersByRoles?OrgId=' +
        id
    );
  }
  uploadUserCoverImage(user: any){
    return this.http.put(
      environment.apiUserUrl + 'AccountService/ChangeUserCoverImage',
      user
    )
   }

   changeIntegrationSetting(user: any){
     return this.http.put(
      environment.apiUserUrl + 'AccountService/ChangeIntegrationSetting',
      user
     )
   }

   saveMagicToken(magicToken: any){
    return this.http.post(
     environment.apiUserUrl + 'AccountService/SaveMagicToken',
     magicToken
    )
  }


  // checkIfUserListExist(domain: any): Observable<User> {
  //   return Observable.create((observer: Subscriber<User>) => {
  //     if (this.user) {
  //       observer.next(this.user);
  //     } else {
  //       this.getAllUser(domain).subscribe((res) => {
  //         this.user = res;
  //         observer.next(res);
  //       });
  //     }
  //   });
  // }


  getUserById(user: User): Observable<User> {
    return this.http.get<User>(
      environment.apiUserUrl +
        'AccountService/GetByIdUser?Id=' +
        user.Id +
        '&OrganisationDomain=' +
        user.OrganisationDomain
    );
  }

  getCurrentUser(user: User): Observable<User> {
    return Observable.create((observer: Subscriber<User>) => {
        this.getUserById(user).subscribe((res) => {
          this.currentUser = res;
          observer.next(res);
        });
    });
  }

  changePassword(user: any){
    return this.http.put(

      environment.apiUserUrl + 'AccountService/ChangePassword',
      user
    )
  }


  // http://localhost:3005/AccountService/GetAllApprover?OrgId=projectobjects

  getAllApprover(orgId: string): Observable<User> {
    return this.http.get<User>(
      environment.apiUserUrl + 'AccountService/GetAllApprover?OrgId=' + orgId
    );
  }

  getAllUserName(domain: any): Observable<string[]> {
    return this.http
      .get<{ [users: string]: userInterface[] }>(
        environment.apiUserUrl +
          'AccountService/GetAllUser?OrganisationDomain=' +
          domain
      )
      .pipe(
        map((resp) =>
          resp.users.map(
            (e: userInterface) => e.firstName + '' + e.lastName + '' + e.id
          )
        )
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
