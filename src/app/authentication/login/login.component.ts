import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';
import { isatty } from 'tty';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  public form: FormGroup;
  public isLoading: boolean = false;
  private authSubscription: Subscription;

  constructor(
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit(){
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required]})
    });

    this.authSubscription = this._authenticationService.getStatusListener().subscribe(
      isAuth => {
        this.isLoading = isAuth;
      }
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onLogin(){
    if(this.form.invalid){
      return;
    }

    this.isLoading = true;
    let usr = this.form.value.email;
    let pwd = this.form.value.password;

    this._authenticationService.login(usr, pwd);
  }

}
