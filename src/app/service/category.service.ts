import { Injectable } from '@angular/core';
import { Category } from '../pojo/category';
import { Http } from '@angular/http';
import { HttpComService } from './httpcom.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class CategoryService extends HttpComService {

  constructor(private http: Http) { super(); }

  fetchAll(): Observable<Category[]> {
    return this.http
      .get(
        environment.endpoints.categories.list,
        { headers: this.headers },
      )
      .map(response => response.json() as Category[])
      .catch(this.handleError);
  }
}
