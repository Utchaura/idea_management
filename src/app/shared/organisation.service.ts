import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organisation } from './organisation.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Team } from './team.model';
import { Category } from './category.model';
import { Tag } from './tag.model';
import { Observable, Subscriber, observable, Subject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  helper = new JwtHelperService();
  org: Organisation = {
    OrganisationName: '',
    Address: '',
    Website: '',
    Country: '',
    OrganisationDomain: '',
    EmailId: '',
    Password: '',
    imageDataBase64: '',
  };

  // team: Team = {
  //   Id: '',
  //   OrganisationId: '',
  //   Code: '',
  //   Description: '',
  // };

  cat: Category = {
    Id: '',
    OrganisationId: '',
    Code: '',
    Description: '',
  };

  tag: Tag = {
    Id: '',
    OrganisationId: '',
    Code: '',
    Description: '',
  };

  organization: any = null;

  constructor(private http: HttpClient, private _router: Router) {}

  onTeamCreate: EventEmitter<any> = new EventEmitter();

  private _listeners = new Subject<any>();
  private _listenerskey = new Subject<any>();

  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  listenkey(): Observable<any> {
    return this._listenerskey.asObservable();
  }

  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  createOrganisation(org: FormData) {
    return this.http.post(
      environment.apiOrgUrl + 'OrgService/CreateOrganisation',
      org
    );
  }

  createTeam(team: any) {
    return this.http.post(
      environment.apiOrgUrl + 'OrgService/createTeam',
      team
    );
  }
  deleteTeam(team: any): Observable<Team> {
    return this.http.delete<Team>(
      environment.apiOrgUrl +
        'OrgService/DeleteTeam/' +
        team.Id +
        '?Id=' +
        team.Id +
        '&OrganisationDomain=' +
        team.OrganisationDomain

    );
  }
  deleteCategory(category: any): Observable<Category> {
    return this.http.delete<Category>(
      environment.apiOrgUrl +
        'OrgService/DeleteCategory/' +
        category.Id +
        '?Id=' +
        category.Id +
        '&OrganisationDomain=' +
        category.OrganisationDomain
        
    );
  }

  createCategory(cat: any) {
    return this.http.post(
      environment.apiOrgUrl + 'OrgService/CreateCategory',
      cat
    );
  }
  createTag(tag: any) {
    return this.http.post(environment.apiOrgUrl + 'OrgService/CreateTag', tag);
  }

  getAllCategory(OrganisationId: any) {
    return this.http.get(
      environment.apiOrgUrl + 'OrgService/GetAllCategory?id=' + OrganisationId
    );
  }

  getAllTeam(OrganisationId: any) {
    return this.http.get(
      environment.apiOrgUrl +
        'OrgService/GetAllTeam?organizationId=' +
        OrganisationId
    );
  }

  getTeamById(value: any) {
    return this.http.get(
      environment.apiOrgUrl + 'OrgService/GetTeamById?id=' + value
    );
  }

  getCategoryById(value: any) {
    return this.http.get(
      environment.apiOrgUrl + 'OrgService/GetCategoryById?id=' + value
    );
  }
  getAllTag(OrganisationId: any) {
    return this.http.get(
      environment.apiOrgUrl + 'OrgService/GetAllTag?id=' + OrganisationId
    );
  }

  updateCategory(cat: any) {
    return this.http.put(
      environment.apiOrgUrl + `OrgService/UpdateCategory/${cat.id}`,
      cat
    );
  }
  updateTeam(id: number, team: any) {
    //return this.http.put (environment.apiOrgUrl + `OrgService/updateTeam/${team.id}`,team);
    return this.http.put(
      environment.apiOrgUrl + 'OrgService/updateTeam/' + id,
      team
    );
  }
  updateTag(tag: any) {
    return this.http.put(
      environment.apiOrgUrl + `OrgService/UpdateTag/${tag.id}`,
      tag
    );
  }

  updateOrganisation(id: number, data: any) {
    return this.http.put(
      environment.apiOrgUrl + 'OrgService/UpdateAsync/' + id,
      data
    );
  }

  getOrganizationByDomain(domain: string): Observable<any> {
    return this.http.get(
      environment.apiOrgUrl +
        'OrgService/GetOrganisationByDomain?organisationdomain=' +
        domain
    );
  }

  checkIfDomainExist(domain: any): Observable<any> {
    return Observable.create((observer: Subscriber<any>) => {
      if (this.organization) {
        observer.next(this.organization);
      } else {
        this.getOrganizationByDomain(domain).subscribe((res) => {
          this.organization = res;
          observer.next(res);
        });
      }
    });
  }
  loginUser(user: any) {
    return this.http.post(
      environment.apiUserUrl + 'AccountService/GetToken',
      user
    );
  }

  loggedIn(): boolean {
    if (
      localStorage.getItem('token') === null ||
      localStorage.getItem('token') === undefined
    ) {
      return false;
    }
    // Get and Decode the Token
    const token = localStorage.getItem('token');
    const decoded = this.helper.decodeToken(token);
    // Check if the cookie is valid

    if (decoded.exp === undefined) {
      return false;
    }

    // Get Current Date Time
    const date = new Date(0);

    // Convert EXp Time to UTC
    let tokenExpDate = date.setUTCSeconds(decoded.exp);

    // If Value of Token time greter than

    if (tokenExpDate.valueOf() > new Date().valueOf()) {
      return true;
    }


    return false;
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/user/login']);
  }
}
