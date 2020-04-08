import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private statusSubscription: Subscription;
  public isUserLogged: boolean = false;

  constructor(
    private _authenticationService: AuthenticationService
  ){}

  ngOnInit(){
    this.isUserLogged = this._authenticationService.isUserAthenticated();
    this.statusSubscription = this._authenticationService.getStatusListener()
      .subscribe(isAuth => {
        this.isUserLogged = isAuth;
      });
  }

  ngOnDestroy(){
    this.statusSubscription.unsubscribe();
  }

  onLogout(){
    this.isUserLogged = false;
    this._authenticationService.logout();
  }
}
