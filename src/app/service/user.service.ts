import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import * as FileSaver from 'file-saver';

import { User } from '../pojo/user';
import { UserQuery } from '../pojo/user';
import { Gender } from '../pojo/gender';
import { Occupation } from '../pojo/occupation';
import { MaritalStatus } from '../pojo/maritalstatus';
import { Status } from '../pojo/status';
import { Transportation } from '../pojo/transportation';

import { environment } from '../../environments/environment';
import { HttpComService } from './httpcom.service'


@Injectable()
export class UserService extends HttpComService {

  private userUrl = environment.restServer + "/admin/userList";
  private userExportUrl = environment.restServer + "/admin/userExportList";
  private maritalStatusUrl = environment.restServer + "/admin/marritalStatusList";
  private occupationUrl = environment.restServer + "/admin/occupationList";
  private genderUrl = environment.restServer + "/admin/genderList";
  private statusUrl = environment.restServer + "/admin/statusList";
  private transportationUrl = environment.restServer + "/admin/transportationList";

  //private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(private http: Http) { super() }

  getUserList(userQuery: UserQuery): Observable<User[]> {
    return this.http.get(this.userUrl, { search: "userQuery=" + JSON.stringify(userQuery.normalize()), headers: this.headers })
      .map(response => response.json() as User[])
      .catch(this.handleError);
  }

  getAllUserCsv(token: string): Observable<string> {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    return this.http
      .get(
        environment.endpoints.v2.users.export,
        {
          headers
        }
      )
      .map(res => res.text());
  }

  getUserExportList(userQuery: UserQuery, excludes: string[] = []): Observable<any> {
    let myHeaders = new Headers();

    myHeaders.append("Authorization", this.headers.get("Authorization"));
    myHeaders.append('Accept', 'vnd.ms-excel');
    myHeaders.append('Content-Type', 'vnd.ms-excel');

    return this.http.get(this.userExportUrl, {
      search: "userQuery=" + JSON.stringify(userQuery.normalize()),
      headers: myHeaders,
      responseType: ResponseContentType.Blob
    })
      .map((response) => {
        var blob = new Blob([response.blob()], { type: 'application/vnd.ms-excel' });
        blob['text']()
          .then(txt => txt.split(/\r?\n/))
          .then(rows => rows.filter(r => {
            const cells = r.split(',');

            return excludes.indexOf(cells[7]) === -1;
          }))
          .then(rows => new Blob([rows.join("\n")], { type: 'application/vnd.ms-excel' }))
          .then(data => FileSaver.saveAs(data, "users.csv"))
          .catch(err => {
            throw err;
          });
      })
      .catch(this.handleError);
  }

  getGenderList(): Observable<Gender[]> {
    return this.http.get(this.genderUrl, { headers: this.headers })
      .map(response => response.json() as Gender[])
      .catch(this.handleError);
  }

  getTransportationList(): Observable<Transportation[]> {
    return this.http.get(this.transportationUrl, { headers: this.headers })
      .map(response => response.json() as Transportation[])
      .catch(this.handleError);
  }

  getStatusList(): Observable<Status[]> {
    return this.http.get(this.statusUrl, { headers: this.headers })
      .map(response => response.json() as Status[])
      .catch(this.handleError);
  }

  getOccupationList(): Observable<Occupation[]> {
    return this.http.get(this.occupationUrl, { headers: this.headers })
      .map(response => response.json() as Occupation[])
      .catch(this.handleError);
  }

  getMaritalStatusList(): Observable<MaritalStatus[]> {
    return this.http.get(this.maritalStatusUrl, { headers: this.headers })
      .map(response => response.json() as MaritalStatus[])
      .catch(this.handleError);
  }


  getUser(id: String): Observable<User> {
    return this.http.get(this.userUrl + "/" + id, { headers: this.headers })
      .map(response => response.json() as User)
      .catch(this.handleError);
  }


  /*
    private handleError(error: any) {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
      //return Observable.throw(errMsg);
    }
    */
}
