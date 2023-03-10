import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { MyWinMenuItemService } from "../service/my-win-menu-item.service";
import { MyWinMenuItem } from "../pojo/my_win_menu_item";
import { Message } from "primeng/primeng";
import { Observable } from "rxjs/Observable";
import { Router, ActivatedRoute } from "@angular/router";
import { UploadService } from '../service/upload.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-win-edit',
  templateUrl: './my-win-edit.component.html',
  styleUrls: ['./my-win-edit.component.css'],
  providers: [MyWinMenuItemService, UploadService],
})
export class MyWinEditComponent implements OnInit {
  filesToUpload: File[] = [];
  msgs: Message[] = [];
  myWinMenuItem$: Observable<MyWinMenuItem>;
  myWinMenuItem: MyWinMenuItem;
  id: string;
  form = new FormGroup({
    title: new FormControl("", Validators.required),
    unit: new FormControl("", Validators.required),
    position: new FormControl("", Validators.required),
    imageUrl: new FormControl(""),
  });

  constructor(
    private myWinMenuItemService: MyWinMenuItemService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) {}

  ngOnInit() {
    this.myWinMenuItem$ = this.route.params
      .map(({ id }) => (this.id = id))
      .switchMap((id) => this.myWinMenuItemService.fetch(id).startWith(null))
      .map((cat) => {
        if (!cat) {
          this.myWinMenuItem = null;
          this.form.reset({});

          return;
        }

        this.myWinMenuItem = cat;
        this.form.reset(cat);

        return cat;
      });
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.myWinMenuItemService.update(this.id, this.form.value).subscribe(
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
    this.myWinMenuItem.imageUrl = null;
    const urlUpload = `${environment.firebaseRestApi}/v1/my-wins/${this.myWinMenuItem.id}/upload`;
    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((downloadUrl) => {
      this.form.get('imageUrl').reset(downloadUrl);
      setTimeout(() => {
        this.myWinMenuItem.imageUrl = downloadUrl;
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
