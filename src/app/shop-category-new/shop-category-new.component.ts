import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { MainCategoryService } from "../service/main-category.service";
import { MainCategory } from "../pojo/mainCategory";
import { Message } from "primeng/primeng";
import { Router, ActivatedRoute } from "@angular/router";
import { ShopCategoryListComponent } from "../shop-category-list/shop-category-list.component";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-shop-category-new",
  templateUrl: "./shop-category-new.component.html",
  styleUrls: ["./shop-category-new.component.css"],
})
export class ShopCategoryNewComponent implements OnInit {
  msgs: Message[] = [];
  parents: MainCategory[] = [];
  parents$: Observable<MainCategory[]> | undefined;

  form = new FormGroup({
    parent: new FormControl(""),
    title: new FormControl("", Validators.required),
    subtitle: new FormControl("", Validators.required),
    position: new FormControl("", Validators.required),
  });

  constructor(
    private mainCategoryService: MainCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.parents$ = this.mainCategoryService
      .fetchParents()
      .map((parents) => (this.parents = parents));
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.mainCategoryService.create(this.form.value).subscribe(
      (id) => {
        this.router.navigate([`../${id}/edit`], { relativeTo: this.route });
        this.msgs.push({
          severity: "info",
          summary: "Saving Shop Category",
          detail: "OK",
        });
      },
      (err) =>
        this.msgs.push({
          severity: "error",
          summary: "Saving Shop Category",
          detail: err,
        })
    );
  }
}
