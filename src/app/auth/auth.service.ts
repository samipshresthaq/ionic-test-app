import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  kind?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  get isUserAuthenticated(): Observable<boolean> {
    return this._user.asObservable().pipe(map(user => {
      if (!user) {
        return false;
      }
      return !!user.token;
    }));
  }

  get userId(): Observable<string> {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return null;
      }
      return user.id;
    }));
  }

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseWebAPIKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    ).pipe(
      tap(this.setUserData.bind(this))
    );
  }

  signUp(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseWebAPIKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
  }

  logout() {
    this._user.next(null);
  }
}
