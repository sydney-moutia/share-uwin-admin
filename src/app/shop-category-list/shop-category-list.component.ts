import { Component, OnInit } from '@angular/core';
import { MainCategory } from '../pojo/mainCategory';
import { Observable } from 'rxjs/Observable';
import { MainCategoryService } from '../service/main-category.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-category-list',
  templateUrl: './shop-category-list.component.html',
  styleUrls: ['./shop-category-list.component.css'],
  providers: [MainCategoryService],
})
export class ShopCategoryListComponent implements OnInit {
  categories$: Observable<MainCategory[]>;
  categories: MainCategory[];
  showPreloader = true;

  constructor(
    private mainCategoryService: MainCategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.showPreloader = true;
    this.categories$ = this.mainCategoryService.fetchAll()
      .map((list) => {
        this.categories = list;
        this.showPreloader = false;

        return list;
      });
  }
  
  onRowSelect(event) {
    const cat: MainCategory = event.data;
    this.router.navigate([cat.id, 'edit'], {relativeTo: this.route});
  }

  getFullCatName(cat: MainCategory) {
    if (!cat.parent || cat.parent.length === 0) {
      return cat.title;
    }

    const parent = this._getCat(cat.parent);
    if (!parent) {
      return `Unknown > ${cat.title}`;
    }

    return `${parent.title} > ${cat.title}`;
  }

  _getCat(catId: string): MainCategory | null {
    if (!this.categories) {
      return null;
    }

    for (let cat of this.categories) {
      if (cat.id === catId) {
        return cat;
      }
    }

    return null;
  }
}
