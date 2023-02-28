import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'token';
const USER_KEY = 'auth-user';
const MAGICTOKEN_KEY = 'magic-token'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  helper = new JwtHelperService();
  constructor(private http: HttpClient, private _router: Router) {}

  loginUser(user: User): Observable<User> {
    return this.http.post<User>(
      environment.apiUserUrl + 'AccountService/GetToken',
      user
    );
  }



  loggedIn(): boolean {
    if (
      sessionStorage.getItem('token') === null ||
      sessionStorage.getItem('token') === undefined
    ) {
      return false;
    }
    const token = sessionStorage.getItem('token');
    const decoded = this.helper.decodeToken(token);

    if (decoded.exp === undefined) {
      return false;
    }

    const date = new Date(0);
    let tokenExpDate = date.setUTCSeconds(decoded.exp);

    if (tokenExpDate.valueOf() > new Date().valueOf()) {
      return true;
    }

    return false;
  }

  checkMagicTokenExpiration(): boolean {
    if (
      localStorage.getItem('magic-token') === null ||
      localStorage.getItem('magic-token') === undefined
    ) {
      return false;
    }
    const magicToken = localStorage.getItem('magic-token');
    const decoded = this.helper.decodeToken(magicToken);

    if (decoded.exp === undefined) {
      return false;
    }
    const date = new Date(0);
    let tokenExpDate = date.setUTCSeconds(decoded.exp);

    if (tokenExpDate.valueOf() > new Date().valueOf()) {
      return true;
    }

    return false;
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth-user');
    localStorage.removeItem('idea-status-title');
    localStorage.removeItem('idea-status');
    localStorage.removeItem('magic-token');


    if(window.location.href.toLowerCase().indexOf('login') == -1){
      window.location.href = '/account/login';
    }

    //this._router.navigate(['/account/login']);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveMagicToken(magicToken: string): void {
    window.sessionStorage.removeItem(MAGICTOKEN_KEY);
    window.sessionStorage.setItem(MAGICTOKEN_KEY, magicToken);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public getMagicToken(): string | null {
    return window.sessionStorage.getItem(MAGICTOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
  }

}
