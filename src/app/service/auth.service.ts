import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpComService } from './httpcom.service'
import { Auth } from '../pojo/auth';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs/observable/of';

interface FirebaseAdminAuth {
  token: string;
}

interface FireStoreRestApiAuth {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface FireStoreRefreshRestApiAuth {
  access_token: string;
  expires_in: string;
  id_token: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
}

@Injectable()
export class AuthService extends HttpComService {
  private loggedIn = false;

  constructor(private http: Http) {
    super();
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  login(email, pwd): Observable<boolean> {
    let url = environment.restServer + "/auth";
    //let headers = new Headers();
    //headers.append('Content-Type', 'application/json');


    let headers = this.headers;
    let token;

    return this.http
      .post(
        url,
        JSON.stringify({ email, pwd }),
        { headers }
      )
      .map(res => res.json() as Auth)
      .map((res) => {
        if (res.success) {
          token = res.token;
          localStorage.setItem('auth_role', res.role);
          localStorage.setItem('auth_name', res.name);
          localStorage.setItem('auth_id', res.id);

          //firebase login
        }

        return res.success;
      })
      .switchMap(success => this.http.post(
        environment.firebase.customTokenEndpoint, {
        "uid": localStorage.getItem('auth_id'),
        "token": token,
      }))
      .map(res => res.json() as FirebaseAdminAuth)
      .switchMap(res => this.http.post(
        environment.firebase.signInWithCustomTokenEndpoint + "?key=" + environment.firebase.apiKey, {
        "token": res.token,
        "returnSecureToken": true,
      }))
      .map(res => res.json() as FireStoreRestApiAuth)
      .map(this.setFirestoreToken)
      .map(isLoggedIn => {
        this.loggedIn = isLoggedIn;
        localStorage.setItem('auth_token', token);

        return isLoggedIn;
      })
      .catch(this.handleError);;


    /*
    return this.http
      .post(
        url, 
        JSON.stringify({ email, pwd }), 
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem('auth_token', res.auth_token);
          localStorage.setItem('auth_role', res.role);
          localStorage.setItem('auth_name', res.name);
          localStorage.setItem('auth_id', res.id);
          this.loggedIn = true;
        }

        return res.success;
      }).catch(this.handleError);;
      */
  }

  isFirestoreTokenValid(): boolean {
    return parseInt(localStorage.getItem('firestore_auth_expired_at')) > Date.now();
  }

  getFirestoreToken(): Observable<string> {
    if (this.isFirestoreTokenValid()) {
      return of(localStorage.getItem('firestore_auth_token'));
    }

    return this.http.post(
      `${environment.firebase.refreshTokenEndpoint}?key=${environment.firebase.apiKey}`,
      this.getFormUrlEncoded({
        refresh_token: localStorage.getItem('firestore_auth_refresh_token'),
        grant_type: 'refresh_token'
      }),
      { headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
    )
      .map(res => res.json() as FireStoreRefreshRestApiAuth)
      .map(res => {
        localStorage.setItem('firestore_auth_token', res.id_token);
        localStorage.setItem('firestore_auth_refresh_token', res.refresh_token);
        localStorage.setItem('firestore_auth_expired_at', (Date.now() + parseInt(res.expires_in) * 1000).toString());

        return true;
      })
      .map(() => localStorage.getItem('firestore_auth_token'));
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_name');
    localStorage.removeItem('auth_id');
    localStorage.removeItem('firestore_auth_token');
    localStorage.removeItem('firestore_auth_refresh_token');
    localStorage.removeItem('firestore_auth_expired_at');

    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
    //return (localStorage.getItem('auth_token') != undefined)
  }

  isAdmin() {
    return (localStorage.getItem('auth_role') && localStorage.getItem('auth_role') === "ADMIN");
  }

  isDirector() {
    return (localStorage.getItem('auth_role') && (localStorage.getItem('auth_role') === "ADMIN" || localStorage.getItem('auth_role') === "DIRECTOR"));
  }

  getId(): string {
    return localStorage.getItem('auth_id');
  }

  private setFirestoreToken(res: FireStoreRestApiAuth) {
    localStorage.setItem('firestore_auth_token', res.idToken);
    localStorage.setItem('firestore_auth_refresh_token', res.refreshToken);
    localStorage.setItem('firestore_auth_expired_at', (Date.now() + parseInt(res.expiresIn) * 1000).toString());

    return true;
  }

  private getFormUrlEncoded(toConvert: any): string {
    const formBody = [];
    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }
}


@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(protected router: Router, private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    return this.auth.isLoggedIn();
  }
}