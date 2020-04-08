import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor  {

  constructor(
    private _authenticationService: AuthenticationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    const token = this._authenticationService.getAuthenticatedToken();
    const modifiedRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + token)
    });
    return next.handle(modifiedRequest);
  }
}
