import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OrganisationService } from './shared/organisation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: OrganisationService,
    private _router: Router
  ) {}

  canActivate(): boolean {
    if (this._authService.loggedIn()) {
      return true;
    } else {
      this._router.navigate(['/account/login']);
      return false;
    }
  }
}
