import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, EmailValidator } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user.model';
import { MustMatch } from '../matcher.validator';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  public form: FormGroup;
  public isLoading: boolean = false;
  public passwordNotMatch: boolean = false;
  public hide: boolean = true;
  public authSubscription: Subscription;

  constructor(
    private _authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      completeName: ['']
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });

    this.authSubscription = this._authenticationService.getStatusListener().subscribe(
      isAuth => {
        this.isLoading = isAuth;
      }
    );
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }

  onSignUp(){
    if(this.form.invalid){
      return;
    }
    this.passwordNotMatch = false;
    if(this.form.value.password !== this.form.value.confirmPassword){
      this.passwordNotMatch = true;
      return;
    }

    this.isLoading = true;
    const newUser: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      completeName: this.form.value.completeName
    }

    this._authenticationService.signupUser(newUser);
  }

  getEmailErrorMessage() {
    let email = this.form.get('email');
    let errorMessage = '';

    if (email.hasError('required')) {
      errorMessage =  'Email is required.';
    }

    if (email.hasError('email')) {
      errorMessage =  'Not a valid email.';
    }

    return errorMessage;
  }

  getConfirmPasswordErrorMessage() {
    let errorMessage = '';
    let confirmPassword = this.form.get('confirmPassword');

    if(confirmPassword.hasError('required')){
      errorMessage = 'Confirm password is required.';
    }

    if(confirmPassword.hasError('mustMatch')){
      errorMessage = 'Passwords must match';
    }

    return errorMessage;
  }

}
