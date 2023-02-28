import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Teams } from '../models/teams-model';
@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  

  constructor(private http: HttpClient) { }

  getAllTeam(OrganisationId: string): Observable<Teams>  {
    return this.http.get<Teams>(
      environment.apiOrgUrl +
        'OrgService/GetAllTeam?organizationId=' +
        OrganisationId
    );
  }
}
