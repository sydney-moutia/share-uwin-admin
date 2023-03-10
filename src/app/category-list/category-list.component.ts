import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from '../pojo/category';
import { Observable } from 'rxjs/Observable';
import { CategoryService } from '../service/category.service';
import { FileUpload } from 'primeng/primeng';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';

interface Subcategory {
  name: string;
  categoryName: string;
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryService],
})
export class CategoryListComponent implements OnInit {
  subcategories: Subcategory[];
  categories$: Observable<Category[]>;
  showPreloader = true;
  @ViewChild('aFileUpload') set content(content: FileUpload) {
    this.fileUpload = content;
    if (this.fileUpload) {
      this.fileUpload.url = environment.endpoints.categories.upload;
    }
  }
  fileUpload: FileUpload;
  constructor(
    private categoryService: CategoryService,
    private http: Http,
  ) { }

  ngOnInit() {
    this.fetchCategories();
  }

  onPrepSendRequestFile(event) {
    this.showPreloader = true;
    let authToken = localStorage.getItem('auth_token');
    if (authToken !== undefined) event.xhr.setRequestHeader("Authorization", authToken);

  }

  download() {
    const headers = new Headers();
    headers.append('Authorization', localStorage.getItem('auth_token'));
    this.http
      .get(`${environment.endpoints.categories.download}`, { headers })
      .subscribe(response => this.downLoadFile(response.arrayBuffer(), "text/csv"));
  }


  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = `uwin_categories_${new Date().getTime()}.csv`;
    anchor.href = window.URL.createObjectURL(blob);
    // anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
    // let pwa = window.open(url);
    // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //   alert('Please disable your Pop-up blocker and try again.');
    // }
  }

  onUploadFile(event) {
    this.fetchCategories();
  }

  onFileError(event) {
    this.showPreloader = false;
  }

  fetchCategories() {
    this.categories$ = this.categoryService
      .fetchAll()
      .map(cats => {
        this.showPreloader = false;
        this.subcategories = cats.reduce((acc, cur) => {
          for (const key in cur.children) {
            if (Object.prototype.hasOwnProperty.call(cur.children, key)) {
              const sub = cur.children[key];
              acc.push({ name: sub, categoryName: cur.name })
            }
          }

          return acc;
        }, [] as Subcategory[]);
        this.showPreloader = false;

        return cats;
      });
  }
}
