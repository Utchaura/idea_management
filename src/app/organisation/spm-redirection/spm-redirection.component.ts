import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-spm-redirection',
  templateUrl: './spm-redirection.component.html',
  styleUrls: ['./spm-redirection.component.css'],
})
export class SpmRedirectionComponent implements OnInit {
  spmLoginLink = environment.spmRedirectionLink;
  helper = new JwtHelperService();
  spmToken: any;
  ProjectId: any;
  Type: string;
  flag: boolean;

  constructor(
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _route: Router,
  ) {}

  ngOnInit(): void {
    var token = this._authService.getMagicToken();
    this.spmToken = this.helper.decodeToken(token);
    this.ProjectId = this.route.snapshot.paramMap.get('ProjectId');
    this.Type = this.route.snapshot.paramMap.get('Type');

  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementsByClassName(
      'btn1'
    )[0] as HTMLElement;
    element.click();
    this._route.navigate(['/organisation/idea-list', true]);
  }
}
