import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Survey } from '../pojo/survey';
import { User } from '../pojo/user';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'

@Injectable()
export class SurveyService extends HttpComService {
  private surveyUrl = environment.restServer + "/admin/surveys";

  constructor(private http: Http) { super(); }


  getSurveys(): Observable<Survey[]> {
    return this.http.get(this.surveyUrl, { headers: this.headers })
      .map(response => response.json() as Survey[])
      .catch(this.handleError);
  }

  createOrUpdateSurvey(survey: Survey): Observable<string> {
    let urlUpdate: string =  this.surveyUrl + "/" + survey.id;
    let urlNew: string =  this.surveyUrl;


    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(survey);

    let url = (survey.id === null) ? urlNew : urlUpdate;

    return this.http.put(url, body, { headers: this.headers })
           .map(response => response.json().id as string)
           .catch(this.handleError);
  }  

  deleteSurvey (survey: Survey) {
     let urlDelete: string =  this.surveyUrl + "/" + survey.id;
     return this.http.delete(urlDelete, { headers: this.headers })
           .map(response => response.json().status as string)
           .catch(this.handleError);
  }


  getSurveyUsers (survey : Survey): Observable<User[]> {
    
    let url: string =  this.surveyUrl + "/" + survey.id + "/users";

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as User[])
      .catch(this.handleError);
  }

}
