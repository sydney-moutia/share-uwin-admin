import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FlashSell, FlashSellUsage } from '../pojo/flashsell';
import { Router } from '@angular/router';
import { FlashSellService } from '../service/flashsell.service'
import {Message} from 'primeng/primeng';
import { UploadService } from '../service/upload.service'
import {Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ItemService } from '../service/item.service';
import { ShopService } from '../service/shop.service';
import { Item } from '../pojo/item';
import { User } from '../pojo/user';
import { Frequency } from '../pojo/frequency';
import {InputSwitchModule} from 'primeng/primeng';
import { UtilsService } from '../service/utils.service'
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service'

@Component({
  //moduleId: module.id,
  selector: 'app-flashsell-detail',
  templateUrl: 'flashsell-detail.component.html',
  styleUrls: ['flashsell-detail.component.css'],
  providers: [FlashSellService, UploadService, ItemService],
})


export class FlashsellDetailComponent implements OnInit {
  @Input() flashsell: FlashSell;
  @Input() flashsellList: FlashSell[];
  @Input() idShop: string;
  @Input() refreshMe: boolean;

  userformFlashsell: FormGroup;

  status: String[] = ['ACTIVE', 'INACTIVE', 'PENDING'];

  msgs: Message[] = [];

  filesToUpload: File[] = [];

  items: Item[];

  availableItems: Item[] = [];

  frequencyList: Frequency[];

  flashsellCopy: FlashSell = new FlashSell();

  disableFrequency : boolean = true;

  flashSellUsageList : FlashSellUsage[] = [];

  isAdmin : boolean;


  constructor(
    private authService : AuthService,
    private flashsellService: FlashSellService,
    private shopService: ShopService,
    private uploadService: UploadService,
    private itemService: ItemService
  ) { }


  getItems(idShop: string): void {
    this.itemService.getItems(idShop).subscribe(
      items => {
        this.items = items;
      },
      error => this.msgs.push({ severity: 'error', summary: 'Item List', detail: error })
    );
  }

  getUsers(idShop: string, idFlashSell: string): void {
    this.flashsellService.getUsers(idShop, idFlashSell).subscribe(
      usages => {
        this.flashSellUsageList = usages;
      },
      error => this.msgs.push({ severity: 'error', summary: 'User List', detail: error })
    );
  }


 getFrequencies (): void {
         this.shopService.getFrequencyList()
        .subscribe(frequencies => this.frequencyList = frequencies,
        error => this.msgs.push({ severity: 'error', summary: 'Frequency List', detail: error })
        );    

 }

  ngOnInit() {

    this.isAdmin = this.authService.isAdmin();

    this.getItems(this.idShop);



    this.userformFlashsell = new FormGroup({
      flashsellState : new FormControl('', Validators.required),
      flashsellFrequency: new FormControl('', null),
      flashSellRunning: new FormControl('', null),
      flashsellName: new FormControl('', Validators.required),
      //discountValue: new FormControl('', Validators.compose([Validators.required, FlashsellDetailComponent.maxValue(this.flashsell.priceItem)])),
      discountValue: new FormControl('',Validators.compose([Validators.required, Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)")])),
      priceItem: new FormControl('', null),
      newPrice: new FormControl('', null),
      description: new FormControl('', Validators.compose([Validators.required])),
      //flashsellFreqValue: new FormControl({value:this.flashsell.frequencyUsage.frequency.id, disabled: true}, null),
      flashsellFreqValue: new FormControl('', Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)")),
    });

    this.getFrequencies();
    //this.checkDisableFrequency();
  }


checkDisableFrequency(event) : void {
  this.disableFrequency = (event === "0");

  if (this.disableFrequency) {
        
        this.flashsell.frequencyMaxSales = 0;
        if (this.userformFlashsell) {
          this.userformFlashsell.get('flashsellFreqValue').markAsDirty();
          this.userformFlashsell.get('flashsellFreqValue').setValidators(null);
          this.userformFlashsell.get('flashsellFreqValue').setErrors(null);
          this.userformFlashsell.updateValueAndValidity();
        }
  }
  else {
        if (this.userformFlashsell) {
          this.userformFlashsell.get('flashsellFreqValue').setValidators(Validators.compose([Validators.required, Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)")]));
          if (this.flashsell.frequencyMaxSales === 0 ||  this.flashsell.frequencyMaxSales === null) 
                  this.userformFlashsell.get('flashsellFreqValue').setErrors({ 'required': true });
          this.userformFlashsell.updateValueAndValidity();
        }
  }

}

  ngOnChanges(changes: SimpleChanges) {

    if (changes['flashsell'] != undefined) {

      let changedItem = changes['flashsell'].currentValue;
      if (changedItem != undefined && changedItem.id != null) {
       // if (this.flashsellCopy.id == null) {
          UtilsService.copyInto(this.flashsell, this.flashsellCopy);
       // }
        if (this.userformFlashsell) {
          this.userformFlashsell.get('discountValue').setValidators(
          Validators.compose([
              Validators.required, 
              Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)"),
              FlashsellDetailComponent.maxValue(this.flashsell.priceItem)]));

          this.userformFlashsell.get('discountValue').setErrors(null);
          this.userformFlashsell.updateValueAndValidity();
        }

        // get the user list

        this.getUsers(this.idShop, this.flashsell.id);

      } else {
      this.flashSellUsageList = [];
      //this.flashsell.idShop = this.idShop;
      }
    }
      // reduce list of items to the ones that are not already used in flash sells -> Only one flash sell per item
      if (this.items != undefined && this.items != null) this.calcAvailableItems ()

      



     if (changes['refreshMe'] != undefined) {

      let changedItem = changes['refreshMe'].currentValue;
      if (changedItem != undefined && changedItem != null) {
        
      this.getItems(this.idShop);

      }
      
      
    }
  }



  calcAvailableItems () {
            if (this.flashsellList != undefined) {

          let tmp: Item[] = this.items.slice();
          let xitem: Item;

          for (let i = 0; i < this.flashsellList.length; i++) {
            xitem = tmp.find(elem => elem.id === this.flashsellList[i].idItem);
            if (xitem != null && this.flashsell !=null && xitem.id != this.flashsell.idItem) {
              // remove item from list
              let indx = tmp.findIndex(ex => ex.id === xitem.id);
              tmp.splice(indx, 1);
            }
          }

          this.availableItems = tmp;


        }
  }

  onItemChange(idItem: string) {

    let seletectedItem = this.items.find(element => element.id === idItem);

    if (seletectedItem != null) {
      
      this.flashsell.priceItem = seletectedItem.price;
      this.flashsell.nameItem = seletectedItem.name;
      this.flashsell.priceItem = seletectedItem.price;
      this.flashsell.discountValue = 0;
      this.userformFlashsell.get('discountValue').setValidators(
          Validators.compose([
              Validators.required, 
              Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)"),
              FlashsellDetailComponent.maxValue(this.flashsell.priceItem)]));
      
      this.userformFlashsell.get('discountValue').setErrors(null);
      this.userformFlashsell.updateValueAndValidity();
    }


  }

  onCancel() {
    //(<HTMLFormElement>document.getElementById("flashsellform")).reset()
    UtilsService.copyInto(this.flashsellCopy, this.flashsell);
    this.userformFlashsell.markAsPristine();

  }

  static maxValue(maxValue: number): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {

      var v: number = control.value;
      return v > maxValue ?
        { "minlengmaxValue": { "required": maxValue, "actualLength": v } } :
        null;
    };
  }


  removePhoto(path) {
    this.flashsell.photoPath = '';
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

      this.flashsell.photoPath = result;
      this.userformFlashsell.markAsDirty();

      this.filesToUpload = [];
      (<HTMLInputElement>document.getElementById("fileUploadFlashSell")).value = '';
    }, (error) => {
      console.error(error);
    });
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  onSubmit() {
    this.msgs = [];
    

    let newItem = (this.flashsell.id === null);

    if (newItem) {
      this.flashsell.remainingNbSales = this.flashsell.frequencyMaxSales;
    } else {
      this.flashsell.remainingNbSales = Math.min(this.flashsell.frequencyMaxSales, this.flashsell.remainingNbSales);
    }

    this.flashsellService.createOrUpdateItem(this.idShop, this.flashsell)
      .subscribe(

      id => {
        this.flashsell.id = id;
        if (newItem) this.flashsellList.push(this.flashsell);
        this.msgs.push({ severity: 'info', summary: 'Saving Flash Sale', detail: 'OK' });
        this.userformFlashsell.markAsPristine();
      },

      // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
      error => this.msgs.push({ severity: 'error', summary: 'Saving Flash Sale', detail: error })
      );
  }

  onDelete() {
    if (this.flashsell !== null && this.flashsell.id !== null)
      this.flashsellService.deleteFlashsell(this.idShop, this.flashsell).subscribe(
        response => {
          if (response === "ok") {
            if (this.flashsellList) {
              let indx = this.flashsellList.findIndex(anItem => anItem === this.flashsell);
              this.flashsellList.splice(indx, 1);
            }
            this.flashsell = null;
          }
        },

        // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
        error => this.msgs.push({ severity: 'error', summary: 'Deleting Flash Sale', detail: error })
      );
  }

}
