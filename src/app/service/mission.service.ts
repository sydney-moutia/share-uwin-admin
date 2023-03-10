import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { Mission } from '../pojo/mission';
import { HttpComService } from './httpcom.service';

@Injectable()
export class MissionService extends HttpComService {

  constructor(private http: Http,) { super(); }

  findAll(): Observable<Mission[]> {
    const url = `${environment.endpoints.missions}/admin/missions`

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as Mission[])
      .catch(this.handleError);
  }

  findOne(id: string): Observable<Mission> {
    const url = `${environment.endpoints.missions}/admin/missions/${id}`
    return this.http.get(url, { headers: this.headers })
    .map(response => response.json() as Mission)
      .catch(this.handleError);
  }

  create(mission: Mission): Observable<void> {
    const url = `${environment.endpoints.missions}/admin/missions`
    return this.http.post(url, mission, { headers: this.headers })
      .map(response => null)
      .catch(this.handleError);
  }

  update(mission: Mission): Observable<void> {
    const url = `${environment.endpoints.missions}/admin/missions/${mission.id}`
    return this.http.post(url, mission, { headers: this.headers })
      .map(response => null)
      .catch(this.handleError);

  }
}
