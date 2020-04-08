import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'post-app';

  constructor(
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit(){
    this._authenticationService.autoAuthUser();
  }
}
