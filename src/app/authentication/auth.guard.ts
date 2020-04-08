import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(
    private _authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    boolean  | Observable<boolean> | Promise<boolean>{
      const isAuth = this._authenticationService.isUserAthenticated();
      if(!isAuth){
        this._authenticationService.routeToLogin();
      }
    return isAuth;
  }

}
