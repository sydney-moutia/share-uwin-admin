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
import { Observable } from "rxjs/Observable";
import { Router, ActivatedRoute } from "@angular/router";
import { UploadService } from '../service/upload.service';
import { environment } from '../../environments/environment';

@Component({
  selector: "app-shop-category-edit",
  templateUrl: "./shop-category-edit.component.html",
  styleUrls: ["./shop-category-edit.component.css"],
  providers: [MainCategoryService, UploadService],
})
export class ShopCategoryEditComponent implements OnInit {
  filesToUpload: File[] = [];
  msgs: Message[] = [];
  category$: Observable<MainCategory>;
  category: MainCategory;
  parents: MainCategory[] = [];
  parents$: Observable<MainCategory[]> | undefined;
  id: string;
  form = new FormGroup({
    parent: new FormControl(""),
    title: new FormControl("", Validators.required),
    subtitle: new FormControl("", Validators.required),
    position: new FormControl("", Validators.required),
    imageUrl: new FormControl(""),
  });

  constructor(
    private mainCategoryService: MainCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) {}

  ngOnInit() {
    this.parents$ = this.mainCategoryService
      .fetchParents()
      .map((parents) => (this.parents = parents));

    this.category$ = this.route.params
      .map(({ id }) => (this.id = id))
      .switchMap((id) => this.mainCategoryService.fetch(id).startWith(null))
      .map((cat) => {
        if (!cat) {
          this.category = null;
          this.form.reset({});

          return;
        }

        this.category = cat;
        this.form.reset(cat);

        return cat;
      });
  }

  delete(event: MouseEvent) {
    event.preventDefault();
    if (confirm("Are you sure ?")) {
      this.mainCategoryService.delete(this.id).subscribe(
        (_) => {
          this.router.navigate(["../../"], { relativeTo: this.route });
          this.msgs.push({
            severity: "info",
            summary: "Deleting Shop Category",
            detail: "OK",
          });
        },
        (err) =>
          this.msgs.push({
            severity: "error",
            summary: "Deleting Shop Category",
            detail: err,
          })
      );
    }
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.mainCategoryService.update(this.id, this.form.value).subscribe(
      (svs) => {
        this.router.navigate(["../../"], { relativeTo: this.route });
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

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  upload(event: MouseEvent) {
    event.preventDefault();
    this.category.imageUrl = null;
    const urlUpload = `${environment.visitMauritiusApi}/v1/main-categories/${this.category.id}/upload`;
    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((downloadUrl) => {
      this.form.get('imageUrl').reset(downloadUrl);
      setTimeout(() => {
        this.category.imageUrl = downloadUrl;
      }, 2000);

      this.filesToUpload = [];
      (<HTMLInputElement>document.getElementById("fileUpload")).value = '';
    }, (err) => {
      console.error(err);
    });
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }
}
