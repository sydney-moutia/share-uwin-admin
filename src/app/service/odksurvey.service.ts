import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { OdkSurvey } from '../pojo/odkSurvey';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'
import * as xml2js from 'xml2js';

@Injectable()
export class OdkSurveyService extends HttpComService {

  private odkSurveyUrl = environment.restServer + "/admin/odkSurveys";

  constructor( private http: Http) {super(); }

  getSurveys(): Observable<OdkSurvey[]> {
    
     return this.http.get(this.odkSurveyUrl, { headers: this.headers })
      .map(response => response.json() as OdkSurvey[])
      .catch(this.handleError);
      
  }


}