import { Component, OnInit } from '@angular/core';
import { Banner } from '../pojo/banner';
import { Observable } from 'rxjs/Observable';
import { BannerService } from '../service/banner.service';
import { tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopTypeService } from '../service/shopType.service';
import { ShopType } from '../pojo/shopType';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/primeng';
import { UploadService } from '../service/upload.service'

@Component({
  selector: 'app-banner-edit',
  templateUrl: './banner-edit.component.html',
  styleUrls: ['./banner-edit.component.css'],
  providers: [ShopTypeService, UploadService],
})
export class BannerEditComponent implements OnInit {
  filesToUpload: File[] = [];
  banner: Banner;
  banner$: Observable<Banner>;
  shopTypes$: Observable<ShopType[]>;
  form: FormGroup;
  msgs: Message[] = [];
  links: { label: string, uri: string }[] = [
    { label: 'My Wins', uri: '/my-wins' },
    { label: 'My Wins / Flashsales', uri: 'my-wins/flash-sales' },
    { label: 'My Wins / Coupons', uri: '/my-wins/coupons' },
    { label: 'My Wins / Vouchers', uri: '/my-wins/vouchers' },
    { label: 'Disclaimer', uri: '/disclaimer' },
    { label: 'Find Shops', uri: '/find-shops' },
    { label: 'Profile', uri: '/profile' },
    { label: 'Edit Profile', uri: '/edit-profile' },
    { label: 'win Credits', uri: '/win-credits' },
  ];

  constructor(
    private bannerService: BannerService,
    private shopTypeService: ShopTypeService,
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      uri: new FormControl('', Validators.required),
      published: new FormControl('', Validators.required),
    });

    this.banner$ = this.bannerService.find(environment.homeBannerId).pipe(tap(banner => {
      this.banner = banner as Banner;
      this.form.reset({
        uri: this.banner.uri,
        published: this.banner.published,
      });
    }));

    this.shopTypes$ = this.shopTypeService.getShopTypes().pipe(tap(shopTypes => {
      for (const st of (shopTypes as ShopType[])) {
        this.links.push(
          {
            label: `Find Shops / ${st.name}`,
            uri: `/find-shops/by-category?category=${encodeURI(st.name)}`
          }
        );
      }
      this.links.sort((a, b) => a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase()));
    }));
  }

  onGoBack() {
    window.history.back();
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  upload() {
    const urlUpload = `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/banners/${this.banner.id}/upload`;
    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((downloadUrl) => {
      this.banner.downloadUrl = downloadUrl;

      this.filesToUpload = [];
      (<HTMLInputElement>document.getElementById("fileUpload")).value = '';
    }, (err) => {
      console.error(err);
    });
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  submit() {
    if (this.form.valid) {
      this.msgs = [];
      const uri = this.form.get('uri').value;
      const published = this.form.get('published').value;
      this.bannerService.update(this.banner.id, { uri, published }).toPromise()
        .then(_ => {
          this.msgs.push({ severity: 'info', summary: 'Saving home banner', detail: 'OK' });
        }, err => {
          console.error(err);
          this.msgs.push({ severity: 'error', summary: 'Saving home banner', detail: err });
        });
    }
  }
}
