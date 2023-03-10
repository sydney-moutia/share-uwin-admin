import { Injectable } from '@angular/core';
import { MainCategory } from '../pojo/mainCategory';
import { Observable }     from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpComService } from './httpcom.service'
import { environment } from '../../environments/environment';

@Injectable()
export class MainCategoryService extends HttpComService {

  constructor(private http: Http) { super(); }

  fetchAll(): Observable<MainCategory[]> {
    const url = `${environment.visitMauritiusApi}/v1/main-categories`;
    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as MainCategory[])
  }

  fetch(id: string): Observable<MainCategory> {
    const url = `${environment.visitMauritiusApi}/v1/main-categories/${id}`;
    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as MainCategory)
  }

  create(cat: MainCategory): Observable<string> {
    const url = `${environment.visitMauritiusApi}/v1/main-categories`;
    return this.http.post(url, cat, { headers: this.headers })
      .map(response => response.json() as {id: string})
      .map(({id}) => id);
  }

  update(id: string, cat: MainCategory): Observable<string> {
    const url = `${environment.visitMauritiusApi}/v1/main-categories/${id}`;
    return this.http.put(url, cat, { headers: this.headers })
      .map(response => response.json() as {id: string})
      .map(({id}) => id);
  }

  delete(id: string): Observable<boolean> {
    const url = `${environment.visitMauritiusApi}/v1/main-categories/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map((_) => true);
  }

  fetchParents(): Observable<MainCategory[]> {
    return this.fetchAll().map(
        (cats) => cats.filter((cat) => !cat.parent || cat.parent.length == 0));
  }
}
