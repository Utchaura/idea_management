import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { Organisation } from 'src/app/models/organisation-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  organization: Organisation;
  constructor(private http: HttpClient) {}

  getOrganizationByDomain(domain: string): Observable<Organisation> {
    return this.http.get<Organisation>(
      environment.apiOrgUrl +
        'OrgService/GetOrganisationByDomain?organisationdomain=' +
        domain
    );
  }

  checkIfDomainExist(domain: any): Observable<Organisation> {
    return Observable.create((observer: Subscriber<Organisation>) => {
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

  createOrganisation(organisation: FormData): Observable<Organisation> {
    return this.http.post<Organisation>(
      environment.apiOrgUrl + 'OrgService/CreateOrganisation',
      organisation
    );
  }

  updateOrganisation(
    organisationId: string,
    organisation: FormData
  ): Observable<Organisation> {
    return this.http.put<Organisation>(
      environment.apiOrgUrl + 'OrgService/UpdateAsync/' + organisationId,
      organisation
    );
  }
}
