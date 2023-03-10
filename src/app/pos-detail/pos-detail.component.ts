import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PosService } from '../service/pos.service'
import { AuthService } from '../service/auth.service'
import { CityService } from '../service/city.service'
import { Pos } from '../pojo/pos';
import { City } from '../pojo/city';
import { WifiStation } from '../pojo/wifistation';

import { GeoCodingService } from '../service/geocoding.service';
import { UploadService } from '../service/upload.service';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { MaxValueValidator } from '../utils/maxvalue.directive';
import { UtilsService } from '../service/utils.service';


declare var google: any;
const qrCodeBaseUrl = 'https://us-central1-uwin-201010.cloudfunctions.net/posQRCode';

@Component({
  selector: 'app-pos-detail',
  templateUrl: 'pos-detail.component.html',
  styleUrls: ['pos-detail.component.css'],
  providers: [PosService, CityService, GeoCodingService, UploadService, UtilsService],
})
export class PosDetailComponent implements OnInit {

  @Input() idShop: string;

  @Input() pos: Pos;

  @Input() posList: Pos[];

  posCopy: Pos = new Pos();

  mapOptions: any;

  mapOverlays: any[];

  cities: City[];

  selectedCity: City;

  msgs: Message[] = [];

  userform: FormGroup;

  submitted: boolean;

  marker: any;

  filesToUpload: File[] = [];

  wifiStation: WifiStation = new WifiStation();
  wifiStationCopy: WifiStation = new WifiStation();

  qrCodeUrl = 'https://via.placeholder.com/1024';

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private posService: PosService,
    private cityService: CityService,
    private geoCodingService: GeoCodingService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.wifiStation = new WifiStation();
    this.wifiStationCopy = new WifiStation();
    this.qrCodeUrl = '';
    if (changes['pos'] != undefined) {
      let changedItem = changes['pos'].currentValue;

      if (changedItem != undefined) {

        if (changedItem.id != null) {
          // Existing Pos

          this.qrCodeUrl = generateQRCodeUrl(this.idShop, changedItem.id, this.pos.name)
          this.selectedCity = this.pos.city;
          if (this.pos.wifiStation != null) {
            this.wifiStation = this.pos.wifiStation;
            UtilsService.copyInto(this.pos.wifiStation, this.wifiStationCopy);
          }
          this.mapOptions = {
            center: { lat: this.pos.lat, lng: this.pos.lng },
            zoom: 16
          };
          this.marker = new google.maps.Marker({ position: { lat: this.pos.lat, lng: this.pos.lng }, draggable: true, title: "Here" });
          this.mapOverlays = [this.marker];


          this.cityService.getCities()
            .subscribe(
              cities => {
                this.cities = cities;
                if (this.pos.city) {
                  let city = this.cities.find((a) => { return (a.id === this.pos.city.id) });
                  this.pos.city = city;
                  this.posCopy.city = this.pos.city;
                }
              },
              error => this.msgs.push({ severity: 'error', summary: 'Cities', detail: error })
            );


          this.makeCopy();


        } else {
          // New Pos
          this.mapOptions = {
            center: { lat: this.pos.lat, lng: this.pos.lng },
            zoom: 16
          };
          this.marker = new google.maps.Marker({ position: { lat: this.pos.lat, lng: this.pos.lng }, draggable: true, title: "Here" });
          this.mapOverlays = [this.marker];
          UtilsService.copyInto(this.pos, this.posCopy);

          this.cityService.getCities()
            .subscribe(
              cities => { this.cities = cities; },
              error => this.msgs.push({ severity: 'error', summary: 'Cities', detail: error })
            );


        }
      }
    }

  }

  ngOnInit(): void {
    this.userform = new FormGroup({
      usageText: new FormControl('', null),
      open: new FormControl('', null),
      website: new FormControl('', null),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      tel: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      usageLimit: new FormControl('', null),
      pwd: new FormControl('', !this.wifiStation.open ? null : Validators.compose([Validators.required, Validators.minLength(8)])),
      macAddress: new FormControl('', !this.wifiStation.open ? null : Validators.compose([Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]){2}$")])),
    });

  }

  makeCopy() {
    UtilsService.copyInto(this.pos, this.posCopy);
    this.posCopy.city = this.pos.city;
    if (this.pos.photoPath != null) this.posCopy.photoPath = this.pos.photoPath.slice();
  }

  getGeocoding(map) {
    this.geoCodingService.getGeoCoding(this.pos.address + '+' + this.selectedCity.name + ',+MU')
      .subscribe(
        geoLocation => {
          if (geoLocation != null) {
            this.pos.lat = geoLocation.lat;
            this.pos.lng = geoLocation.lng;
            this.marker.setPosition(geoLocation);

            map.setCenter(geoLocation);
            map.panTo(geoLocation);
            map.setZoom(16);
          }
        },
        error => this.msgs.push({ severity: 'error', summary: 'Google Geo Coding', detail: error })
      );

  }

  onCityChange(newValue) {
    if (this.cities)
      this.selectedCity = this.cities.find(aCity => aCity.id === newValue.id);

  }


  handleDragEnd(event) {
    this.pos.lat = event.overlay.position.lat();
    this.pos.lng = event.overlay.position.lng();
    this.userform.get('longitude').markAsDirty();
    this.userform.get('latitude').markAsDirty();
  }

  removePhoto(path) {
    this.pos.photoPath = this.pos.photoPath.filter(aPath => aPath !== path);
    this.userform.markAsDirty();
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

      if (this.pos.photoPath != null)
        this.pos.photoPath.push(result);
      else
        this.pos.photoPath = [result];

      this.filesToUpload = [];
      this.userform.markAsDirty();
      (<HTMLInputElement>document.getElementById("fileUpload")).value = '';
    }, (error) => {
      console.error(error);
    });
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  onSubmit() {

    let newItem = (this.pos.id === null);

    if (this.wifiStation.open || this.wifiStation.macAddress !== '') {
      this.pos.wifiStation = this.wifiStation;
      this.pos.wifiStation.usageLimit = +this.pos.wifiStation.usageLimit;
    }


    this.posService.createOrUpdatePos(this.idShop, this.pos)
      .subscribe(

        id => {
          let newPos = (this.pos.id === null);
          this.pos.id = id;


          this.msgs.push({ severity: 'info', summary: 'Saving Point of Sale', detail: 'OK' });

          if (newItem) this.posList.push(this.pos);

          this.userform.markAsPristine();

        },
        error => this.msgs.push({ severity: 'error', summary: 'Saving Point of Sale', detail: error })
      );
  }

  openWifiChanged() {
    if (this.wifiStation.open) {
      this.userform.get('pwd').setValidators(Validators.compose([Validators.required, Validators.minLength(8)]));
      if (this.wifiStation.pwd == null || this.wifiStation.pwd === '') this.userform.get('pwd').setErrors({ 'required': true });
      this.userform.get('macAddress').setValidators(Validators.compose([Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]){2}$")]));
      if (this.wifiStation.macAddress == null || this.wifiStation.macAddress === '') this.userform.get('macAddress').setErrors({ 'required': true });
      this.userform.updateValueAndValidity();
    } else {
      this.userform.get('pwd').setValidators(null);
      this.userform.get('pwd').setErrors(null);
      this.userform.get('macAddress').setValidators(null);
      this.userform.get('macAddress').setErrors(null);
      this.userform.updateValueAndValidity();
    }

  }

  onGoBack() {
    window.history.back();
  }

  onCancel() {
    UtilsService.copyInto(this.posCopy, this.pos);
    this.pos.city = this.posCopy.city;
    this.userform.markAsPristine();
    this.pos.photoPath = this.posCopy.photoPath;

    this.mapOptions = {
      center: { lat: this.pos.lat, lng: this.pos.lng },
      zoom: 16
    };
    this.marker = new google.maps.Marker({ position: { lat: this.pos.lat, lng: this.pos.lng }, draggable: true, title: "Here" });
    this.mapOverlays = [this.marker];

    UtilsService.copyInto(this.wifiStationCopy, this.wifiStation);
    this.pos.wifiStation = this.wifiStation;
  }

  onDelete() {
    if (this.pos !== null && this.pos.id !== null)
      this.posService.deletePos(this.idShop, this.pos).subscribe(
        response => {
          if (response === "ok") {
            if (this.pos) {
              let indx = this.posList.findIndex(anItem => anItem === this.pos);
              this.posList.splice(indx, 1);
            }
            this.pos = null;
          }
        },

        error => this.msgs.push({ severity: 'error', summary: 'Deleting Point of Sale', detail: error })
      );
  }

}

function generateQRCodeUrl(idShop: string, idPos: string, posName: string): string {
  return `${qrCodeBaseUrl}/shops/${idShop}/pos/${idPos}?filename=${posName}.png`;
}