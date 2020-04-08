import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { PostService } from '../posts/post.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { error } from 'protractor';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private isAuthenticated: boolean = false;
  private authToken: string = '';
  private status = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private userId: string = '';

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) {}

  signupUser(user: User){
    this._http.post<{
      message: string,
      user: {
        id: string,
        email: string,
        password: string,
        completeName: string
      }
    }>('http://localhost:3000/api/users/signup', user)
      .subscribe((data)=>{
        this.routeToPostList();
      }, error => {
        this.status.next(false);
      });
  }

  login(email: string, pwd: string){
    const user: User = {
      email: email,
      password: pwd,
      completeName: ''
    }
    this._http.post<{authToken: string, expiresIn: number, userId: string}>('http://localhost:3000/api/users/login', user)
      .subscribe(data => {
        if(data.authToken){
          const expires = data.expiresIn;
          this.setAuthTimer(expires);
          this.authToken = data.authToken;
          this.isAuthenticated = true;
          this.status.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expires * 1000));
          this.userId = data.userId;
          this.saveAuthData(this.authToken, expirationDate, this.userId);
          this.routeToPostList();
        }
      },error => {
        this.status.next(false);
      });
  }

  isUserAthenticated(){
    return this.isAuthenticated;
  }

  getAuthenticatedToken(){
    return this.authToken;
  }

  getUserId(){
    return this.userId;
  }

  autoAuthUser(){
    const auth = this.getAuthData();

    if(!auth){
      return;
    }

    const now = new Date();
    const expiresIn = auth.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      this.authToken = auth.token;
      this.isAuthenticated = true;
      this.userId = auth.userId;
      this.status.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  logout(){
    this.authToken = null;
    this.isAuthenticated = false;
    this.status.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.routeToPostList();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getStatusListener(){
    return this.status.asObservable();
  }

  routeToPostList(){
    this._router.navigate(['/list']);
  }

  routeToLogin(){
    this._router.navigate(['/login']);
  }
}

