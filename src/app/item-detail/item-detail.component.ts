import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { combineLatest } from 'rxjs/operators';
//import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms'
import { environment } from '../../environments/environment';
import { Item } from '../pojo/item';
import { ProductMainCategory } from '../pojo/product_main_category';
import { ItemService } from '../service/item.service';
import { ProductExtService } from '../service/product-ext.service';
import { ProductMainCategoryService } from '../service/product-main-category.service';
import { UploadService } from '../service/upload.service';
import { UtilsService } from '../service/utils.service';

@Component({
  //moduleId: module.id,
  selector: 'app-item-detail',
  templateUrl: 'item-detail.component.html',
  styleUrls: ['item-detail.component.css'],
  providers: [ItemService, UploadService],
  //directives: [REACTIVE_FORM_DIRECTIVES]
})


export class ItemDetailComponent implements OnInit, OnChanges {
  @Input() item: Item;
  @Input() itemList: Item[];
  @Input() idShop: string;

  prodExt: ProductExt;
  userformItem: FormGroup;

  msgs: Message[] = [];

  filesToUpload: File[] = [];

  itemCopy: Item = new Item();

  isAdmin: boolean;

  cats: ProductMainCategory[] = [];

  productExtForm: FormGroup;

  constructor(
    private itemService: ItemService,
    private uploadService: UploadService,
    private productExtService: ProductExtService,
    private catService: ProductMainCategoryService,
  ) {
    this.productExtForm = new FormGroup({
      normalPrice: new FormControl(),
      quantityAvailable: new FormControl(),
    });
  }

  ngOnInit() {
    this.isAdmin = localStorage.getItem('auth_role') === 'ADMIN';
    this.prodExt = this.productExtService.create(this.idShop, null);

    this.userformItem = new FormGroup({
      itemName: new FormControl('', Validators.required),
      itemDescription: new FormControl('', Validators.required),
      // itemPhotoPath:  new FormControl('', Validators.required),
      itemPrice: new FormControl('', Validators.compose([Validators.required, Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)")])),
      //itemPrice: new FormControl('', Validators.required)
      //itemPrice: new FormControl('', Validators.required)
      category1: new FormControl(''),
      subcategory1: new FormControl(),
      category2: new FormControl(''),
      subcategory2: new FormControl(''),
    });
  }

  onCancel() {
    //(<HTMLFormElement>document.getElementById("flashsellform")).reset()
    UtilsService.copyInto(this.itemCopy, this.item);
    this.userformItem.markAsPristine();

  }

  /*
    ngOnChanges(changes: SimpleChanges) {
  
      if (changes['item'] != undefined) {
  
        let changedItem = changes['item'].currentValue;
        if (changedItem != undefined && changedItem.id === null)
          if (this.userformItem) {
            this.userformItem.get('itemPrice').setValue('');
            this.userformItem.get('itemPrice').reset();
            this.userformItem.get('itemPrice').updateValueAndValidity();
          }
       
      }
    }
  */

  removePhoto(path) {
    this.item.photoPath = '';
  }

  getPhotoFolder(path) {
    return environment.restServer + "/files/shops/" + this.idShop + "/" + path;
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  upload() {
    let urlUpload = environment.restServer + "/admin/shops/" + this.idShop + "/" + "uploadFile";

    this.uploadService.getObserver().subscribe((result) => console.log("Observe : " + result));

    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((result) => {

      this.item.photoPath = result;
      this.userformItem.markAsDirty();

      this.filesToUpload = [];
      (<HTMLInputElement>document.getElementById("fileUploadItem")).value = '';
    }, (error) => {
      console.error(error);
    });
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  onDelete() {
    if (this.item !== null && this.item.id !== null)
      this.itemService.deleteItem(this.item).subscribe(
        response => {
          if (response === "ok") {
            if (this.itemList) {
              let indx = this.itemList.findIndex(anItem => anItem === this.item);
              this.itemList.splice(indx, 1);
            }
            this.item = null;
          }
        },

        // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
        error => this.msgs.push({ severity: 'error', summary: 'Saving Shop', detail: error })
      );
  }

  onArchive() {
    if (this.item !== null && this.item.id !== null) {
      this.productExtService.archive(this.idShop, this.item).switchMap(() => {
        this.item.name = `###OLD.${Date.now()}### ${this.item.name}`;

        return this.itemService.createOrUpdateItem(this.item, this.idShop);
      }).subscribe(
        () => {
          if (this.itemList) {
            let indx = this.itemList.findIndex(anItem => anItem === this.item);
            this.itemList.splice(indx, 1);
          }
          this.item = null
        },
        error => this.msgs.push({ severity: 'error', summary: 'Saving Shop', detail: error })
      );
    }
  }

  onSubmit() {
    this.msgs = [];

    let newItem = (this.item.id === null);

    this.itemService
      .createOrUpdateItem(this.item, this.idShop)
      .map(id => {
        this.prodExt.id.stringValue = id;
        this.prodExt.name = { stringValue: this.item.name };
        this.prodExt.description = { stringValue: this.item.description };
        this.prodExt.price = { doubleValue: this.item.price };
        this.prodExt.photoPath = { stringValue: this.item.photoPath || '' };

        return this.prodExt;
      })
      .switchMap(prodExt => {
        const formNormalPrice = this.productExtForm.get('normalPrice').value;
        if (formNormalPrice || formNormalPrice === 0) {
          prodExt.normalPrice = { integerValue: Math.round(formNormalPrice * 100) };
        }
        prodExt.quantityAvailable = { integerValue: this.productExtForm.get('quantityAvailable').value };

        return this.productExtService.save(prodExt)
      })
      .map(prodExt => prodExt.id.stringValue)
      .subscribe(
        id => {
          this.item.id = id;
          if (newItem) this.itemList.push(this.item);
          this.msgs.push({ severity: 'info', summary: 'Saving Item', detail: 'OK' });
          this.userformItem.markAsPristine();
        },

        // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
        error => this.msgs.push({ severity: 'error', summary: 'Saving Item', detail: error })
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] != undefined) {
      let changedItem = changes['item'].currentValue;
      if (changedItem != undefined && changedItem.id != null) {

        // if (this.itemCopy.id == null) {
        UtilsService.copyInto(this.item, this.itemCopy);
        // }
      }
    }
    this.cats = [];
    this.prodExt = this.productExtService.create(this.idShop, null);
    this.catService.fetchAll()
      .pipe(
        combineLatest(
          this.productExtService.fetch(this.idShop, this.item),
          (cats: ProductMainCategory[], prodExt) => addDefaultCat(cats, prodExt),
        )
      )
      .subscribe(cats => {
        return this.cats = cats;
      });
    this.productExtService
      .fetch(this.idShop, this.item)
      .subscribe(
        prodExt => {
          this.prodExt = prodExt;
          this.productExtForm.reset({
            normalPrice: prodExt.normalPrice.integerValue / 100,
            quantityAvailable: prodExt.quantityAvailable.integerValue,
          });
        },
        err => {
          console.error(err);
          this.prodExt = this.productExtService.create(this.idShop, null);
        }
      );
  }

  childrenToList(cats: ProductMainCategory[], catName: string): string[] {
    const list: string[] = [];
    const filter = cats.filter((it) => it.name.stringValue === catName);

    if (filter.length === 0) {
      return list;
    }

    for (const key in filter[0].children.mapValue.fields) {
      if (filter[0].children.mapValue.fields.hasOwnProperty(key)) {
        list.push(filter[0].children.mapValue.fields[key].stringValue);
      }
    }
    list.sort((a, b) => a.localeCompare(b));

    return list;
  }
}

function addDefaultCat(cats: ProductMainCategory[], prodExt: ProductExt): ProductMainCategory[] {
  let cat1: ProductMainCategory, cat2: ProductMainCategory;
  let sub1: FirestoreString, sub2: FirestoreString;

  for (const cat of cats) {
    if (cat.name.stringValue === prodExt.category1.stringValue) {
      cat1 = cat;
    }
    if (cat.name.stringValue === prodExt.category2.stringValue) {
      cat2 = cat;
    }

    if (cat.children.mapValue.fields) {
      for (const sub of Object.keys(cat.children.mapValue.fields)) {
        if (cat.name.stringValue == prodExt.category1.stringValue && sub === prodExt.subcategory1.stringValue) {
          sub1 = { stringValue: sub };
        }

        if (cat.name.stringValue === prodExt.category2.stringValue && sub === prodExt.subcategory2.stringValue) {
          sub2 = { stringValue: sub };
        }
      }
    }
  }

  if (!cat1) {
    const fields = {}
    cat1 = { name: prodExt.category1, children: { mapValue: { fields } } };
    cats.push(cat1);
  }

  if (!cat2) {
    const fields = {}
    cat2 = { name: prodExt.category2, children: { mapValue: { fields } } };
    cats.push(cat2);
  }

  if (!sub1) {
    cat1.children.mapValue.fields[prodExt.subcategory1.stringValue] = prodExt.subcategory1;
  }

  if (!sub2) {
    cat2.children.mapValue.fields[prodExt.subcategory2.stringValue] = prodExt.subcategory2;
  }

  return cats
}