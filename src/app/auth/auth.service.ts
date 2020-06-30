import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { threadId } from 'worker_threads';

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
export class AuthService implements OnDestroy{
  private _user = new BehaviorSubject<User>(null);
  private autoLogoutTimer: any;

  get isUserAuthenticated(): Observable<boolean> {
    return this._user.asObservable().pipe(
      map((user) => {
        if (!user) {
          return false;
        }
        return !!user.token;
      })
    );
  }

  get userId(): Observable<string> {
    return this._user.asObservable().pipe(
      map((user) => {
        if (!user) {
          return null;
        }
        return user.id;
      })
    );
  }

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseWebAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
    Plugins.Storage.remove({ key: 'authData' });
    this._user.next(null);
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

  autoLogin() {
    return this.getAuthData.pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          email: string;
          tokenExpiryDate: string;
        };
        const expirationTime = new Date(parsedData.tokenExpiryDate);

        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );

        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number) {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }

    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private storeAuthData(
    userId: string,
    token: string,
    email: string,
    tokenExpiryDate: string
  ) {
    const authData = {
      userId,
      token,
      email,
      tokenExpiryDate,
    };

    Plugins.Storage.set({
      key: 'authData',
      value: JSON.stringify(authData),
    });
  }

  private get getAuthData() {
    return from(Plugins.Storage.get({ key: 'authData' }));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const newUser = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );

    this._user.next(newUser);
    this.autoLogout(newUser.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      userData.email,
      expirationTime.toISOString()
    );
  }

  ngOnDestroy() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }
}
