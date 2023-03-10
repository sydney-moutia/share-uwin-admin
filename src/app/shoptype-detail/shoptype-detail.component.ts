import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { ShopType } from "../pojo/shopType";
import { ShopTypeService } from "../service/shopType.service";
import { Message } from "primeng/primeng";
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { UtilsService } from "../service/utils.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UploadService } from '../service/upload.service'

@Component({
  selector: "app-shoptype-detail",
  templateUrl: "shoptype-detail.component.html",
  styleUrls: ["shoptype-detail.component.css"],
  providers: [ShopTypeService, UploadService],
})
export class ShopTypeDetailComponent implements OnInit, OnChanges {
  @Input() shopType: ShopType;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();

  imageUrl: undefined | string;
  iconUrl: undefined | string;
  filesToUpload: File[] = [];
  iconsToUpload: File[] = [];

  userformShopType: FormGroup;

  msgs: Message[] = [];

  idCurrentShopType: string;

  shopTypeCopy: ShopType = new ShopType();

  constructor(
    private shopTypeService: ShopTypeService,
    private uploadService: UploadService,
  ) {}

  ngOnInit() {
    this.idCurrentShopType = localStorage.getItem("auth_id");

    this.userformShopType = new FormGroup({
      name: new FormControl("", Validators.required),
      position: new FormControl("", Validators.required),
      publishedOnWin: new FormControl("", Validators.required),
    });
  }

  getShopType(id: string): void {
    this.shopTypeService.getShopType(id).subscribe(
      (shopType) => {
        this.shopType = shopType;
      },
      (error) =>
        this.msgs.push({
          severity: "error",
          summary: "Shop Type List",
          detail: error,
        })
    );
  }

  onCancel() {
    UtilsService.copyInto(this.shopTypeCopy, this.shopType);
    this.userformShopType.markAsPristine();
  }

  onDelete() {
    if (this.shopType !== null && this.shopType.id !== null)
      this.shopTypeService.deleteShopType(this.shopType).subscribe(
        (response) => {
          if (response === "ok") {
            this.deleted.emit(this.shopType);
          }
        },
        (error) =>
          this.msgs.push({
            severity: "error",
            summary: "Saving Shop Type",
            detail: error,
          })
      );
  }

  onSubmit() {
    this.msgs = [];

    let newItem = this.shopType.id === null;
    const value: ShopType = this.userformShopType.value;
    value.id = this.shopType.id;
    value.position = +value.position;
    value.publishedOnWin = this.userformShopType.value.publishedOnWin === 'true';

    this.shopTypeService.createOrUpdateShopType(value)
    .subscribe(
      (id) => {
        this.shopType.id = id;
        this.shopType.name = value.name;
        this.shopType.position = value.position;
        this.shopType.publishedOnWin = value.publishedOnWin;
        this.shopType.imageUrl = value.imageUrl;
        this.saved.emit(this.shopType);
        UtilsService.copyInto(this.shopType, this.shopTypeCopy);
        this.msgs.push({
          severity: "info",
          summary: "Saving Shop Type",
          detail: "OK",
        });
        this.userformShopType.markAsPristine();
      },

      // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
      (error) => {
        this.msgs.push({
          severity: "error",
          summary: "Saving Shop Type",
          detail: error,
        });
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["shopType"] != undefined) {
      let changedItem = changes["shopType"].currentValue;
      if (changedItem != undefined && changedItem.id != null) {
        this.userformShopType.reset({
          name: changedItem.name,
          position: `${changedItem.position}` || '0',
          publishedOnWin: (changedItem.publishedOnWin ? 'true' : 'false') || 'false',
        });
        this.imageUrl = changedItem.imageUrl || undefined;
        this.iconUrl = changedItem.iconUrl || undefined;
      } else if (changedItem && !changedItem.id) {
        this.userformShopType.reset();
      }
    }
  }

  iconChangeEvent(fileInput: any) {
    this.iconsToUpload = <Array<File>>fileInput.target.files;
  }

  canUploadIcon() {
    return this.iconsToUpload.length > 0;
  }

  uploadIcon() {
    const urlUpload = `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shop-types/${this.shopType.id}/upload-icon`;
    this.uploadService.makeFileRequest(urlUpload, this.iconsToUpload).subscribe((imageUrl) => {
      this.iconUrl = imageUrl;

      this.iconsToUpload = [];
      (<HTMLInputElement>document.getElementById("iconUpload")).value = '';
    }, (err) => {
      console.error(err);
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  upload() {
    const urlUpload = `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shop-types/${this.shopType.id}/upload`;
    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((imageUrl) => {
      this.imageUrl = imageUrl;

      this.filesToUpload = [];
      (<HTMLInputElement>document.getElementById("fileUpload")).value = '';
    }, (err) => {
      console.error(err);
    });
  }
}
