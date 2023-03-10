import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TopicNotification } from '../pojo/topic_notification';
import { AuthService } from './auth.service';

@Injectable()
export class NotificationService {

  constructor(
    private http: Http,
    private authService: AuthService,
  ) { }

  sendNews(title: string, message: string): Observable<string> {
    return this.authService.getFirestoreToken()
      .switchMap(token => {
        const headers = new Headers({ Authorization: `Bearer ${token}` });
        return this.http.post(environment.endpoints.notifications.create, { title, message }, { headers })
      })
      .map(res => {
        if (res.status !== 204) {
          console.error({ httpStatusCode: res.status });
          console.error(res.text());
          throw new Error('Could not send message');
        }
      })
      .map(_ => message);
  }

  findAll(): Observable<TopicNotification[]> {
    return this.authService.getFirestoreToken()
      .switchMap(token => {
        const headers = new Headers({ Authorization: `Bearer ${token}` });
        return this.http.get(environment.endpoints.notifications.list, { headers })
      })
      .map(res => res.json() as { [key: string]: any }[])
      .map(data => {
        data.map(d => {
          d['createdAt'] = d['createdAt']['_seconds'] * 1000;
          return d;
        });

        return data as TopicNotification[];
      });
  }
}
