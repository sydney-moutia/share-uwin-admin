import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service'
import { CityService } from '../service/city.service'
import { User } from '../pojo/user';
import { UserQuery } from '../pojo/user';

import { Gender } from '../pojo/gender';
import { MaritalStatus } from '../pojo/maritalstatus';
import { Status } from '../pojo/status';
import { Occupation } from '../pojo/occupation';
import { City } from '../pojo/city';
import { Transportation } from '../pojo/transportation';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';




import { Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { Message } from 'primeng/primeng';

import * as moment_ from 'moment';
import { map } from 'rxjs/operators';
import { UnaryFunction } from 'rxjs/interfaces';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../service/auth.service';
import { env } from 'process';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operator/switchMap';
const moment: any = (<any>moment_).default || moment_;

@Component({
  //moduleId: module.id,
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css'],
  providers: [UserService, CityService]
})



export class UserListComponent implements OnInit {

  error: any;
  users: User[];
  genderList: Gender[];
  maritalStatusList: MaritalStatus[];
  occupationList: Occupation[];
  selectedUser: User;
  cityList: City[];
  originalCities: City[];
  statusList: Status[];
  districtList: string[];
  transportationList: Transportation[];
  nbChildrenList: number[] = [0, 1, 2, 3];
  nbChildrenLimitList: string[] = ["At least", "At most"];
  radiusList: string[];
  showStatus: boolean = true;
  showCity: boolean = true;
  showOccupation: boolean = true;
  showGender: boolean = true;
  showMaritalStatus: boolean = false;
  showTransportation: boolean = false;
  showNbChildren: boolean = false;
  userListForm: FormGroup;
  fromDate: Date = null;
  toDate: Date = null;
  nbMatchingUsers: string;
  //fromBirthday: Date = null;
  //toBirthday: Date = null;
  userQuery: UserQuery;

  bDateFromOptions: DatePickerOptions;
  bDateFromModel: DateModel;

  bDateToOptions: DatePickerOptions;
  bDateToModel: DateModel;

  bDayFromOptions: DatePickerOptions;
  bDayFromModel: DateModel;

  bDayToOptions: DatePickerOptions;
  bDayToModel: DateModel;

  msgs: Message[] = [];

  exportAllSpinner = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private cityService: CityService) {
  }

  getExclude(): string[] {
    const inp = this.userListForm.get('exclude').value;
    if (!inp) {
      return [];
    }

    return inp.split(/\r?\n/);
  }

  mapExcludeUser(excl: string[]): (user: User[]) => User[] {
    return;
  }

  getUserList(): void {
    this.nbMatchingUsers = "Retrieving...";
    const excl = this.getExclude();
    this.userService.getUserList(this.userQuery)
      .pipe(map((users: User[]) => users.filter(u => excl.indexOf(u.email) === -1)))
      .subscribe(
        users => { this.users = users; this.nbMatchingUsers = "" + users.length; if (users.length == 5000) this.nbMatchingUsers += " ! More exist" },
        error => this.msgs.push({ severity: 'error', summary: 'User List', detail: error })
      );
  }

  getUserExportList(): void {
    this.nbMatchingUsers = "Exporting...";
    this.userService.getUserExportList(this.userQuery, this.getExclude())
      .subscribe(
        text => { this.nbMatchingUsers = ""; },
        error => this.msgs.push({ severity: 'error', summary: 'User List', detail: error })
      );
  }

  getGenderList(): void {
    let all: Gender = new Gender("-1", "All");
    this.genderList = [all];
    this.userQuery.gender = all.id;

    this.userService.getGenderList().subscribe(
      genders => this.genderList = this.genderList.concat(genders),
      error => this.msgs.push({ severity: 'error', summary: 'Gender List', detail: error })
    );
  }

  getTransportationList(): void {
    let all: Transportation = new Transportation("-1", "All");
    this.transportationList = [all];
    this.userQuery.transportation = all.id;

    this.userService.getTransportationList().subscribe(
      transportations => this.transportationList = this.transportationList.concat(transportations),
      error => this.msgs.push({ severity: 'error', summary: 'Gender List', detail: error })
    );
  }

  getMaritalStatusList(): void {
    let all: MaritalStatus = new MaritalStatus("-1", "All");
    this.maritalStatusList = [all];
    this.userQuery.maritalStatus = all.id;

    this.userService.getMaritalStatusList().subscribe(
      maritalStatus => this.maritalStatusList = this.maritalStatusList.concat(maritalStatus),
      error => this.msgs.push({ severity: 'error', summary: 'Marital Status List', detail: error })
    );
  }

  getStatusList(): void {
    let all: Status = new Status("-1", "All");
    this.statusList = [all];
    this.userQuery.status = all.id;
    this.userService.getStatusList().subscribe(
      status => this.statusList = this.statusList.concat(status),
      error => this.msgs.push({ severity: 'error', summary: 'Status List', detail: error })
    );
  }

  getOccupationList(): void {
    let all: Occupation = new Occupation("-1", "All");
    this.occupationList = [all];
    this.userQuery.occupation = all.id;

    this.userService.getOccupationList().subscribe(
      occupations => this.occupationList = this.occupationList.concat(occupations),
      error => this.msgs.push({ severity: 'error', summary: 'Occupation List', detail: error })
    );
  }

  getCityList(): void {
    let all: City = new City("-1", "All", "All");
    this.cityList = [all];
    this.userQuery.city = all.id;

    this.districtList = ["All"];
    this.userQuery.district = "All";

    this.radiusList = ["None", "5", "10", "20", "50", "100"];
    this.userQuery.radius = this.radiusList[0];

    this.cityService.getCities()
      .subscribe(
        cities => {
          this.cityList = this.cityList.concat(cities);
          this.originalCities = this.cityList;
          for (let i = 0; i < cities.length; i++) {
            if (this.districtList.indexOf(cities[i].district) < 0) this.districtList.push(cities[i].district);
          }
        },
        error => this.msgs.push({ severity: 'error', summary: 'City List', detail: error })
      );
  }

  filterCityList(district: string): void {
    this.cityList = (district === "All") ? this.originalCities : this.originalCities.filter(city => { return (city.district === district) });

    if (district !== "All") {
      let all: City = new City("-1", "All", "All");
      this.cityList.unshift(all);
    }

    this.userQuery.city = this.cityList[0].id;
  }


  cityChange(city: string) {
    if (city === "-1") this.userQuery.radius = this.radiusList[0];
  }


  onRowSelect(event) {
    /*
    this.selectedUser = event.data;
    let link = ['/userDetail', this.selectedUser.id];
    this.router.navigate(link);
    */
  }

  initUserQueryDates(): void {
    this.userQuery.bDateFrom = this.bDateFromModel.momentObj;
    this.userQuery.bDateTo = this.bDateToModel.momentObj;
    this.userQuery.bDayFrom = this.bDayFromModel.momentObj;
    this.userQuery.bDayTo = this.bDayToModel.momentObj;
  }

  onSubmit(): void {
    this.initUserQueryDates();
    this.getUserList();
  }

  onExport(): void {
    this.initUserQueryDates();
    this.getUserExportList();
  }

  onExportAll(token: string): void {
    this.exportAllSpinner = true;
    this.authService
      .getFirestoreToken()
      .switchMap(jwt => this.userService.getAllUserCsv(jwt))
      .subscribe(data => {
        // create a blob url representing the data
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        // attach blob url to anchor element with download attribute
        const anchor = document.createElement('a');
        const now = moment();
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', `export_all_users_${now.format('YYYY-MM-DD-hhmmss')}.csv`);
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.exportAllSpinner = false;
      }, err => {
        this.exportAllSpinner = false;
        console.error(err);
      });
  }

  onCancel(): void {
    this.userQuery = new UserQuery();
    this.initDates();
  }

  initDates(): void {
    let dateFormat = "DD/MM/YYYY";
    let yearOnlyDateFormat = "YYYY";
    let noYearDateFormat = "DD MMMM";


    let today = new moment();
    let oldestBDate = new moment();


    oldestBDate.year(oldestBDate.year() - 100);
    oldestBDate.dayOfYear(1);


    if (this.bDateFromOptions == null) {
      this.bDateFromModel = new DateModel();
      this.bDateFromModel.momentObj = oldestBDate;
      this.bDateFromOptions = new DatePickerOptions();
      this.bDateFromOptions.initialDate = oldestBDate.toDate();
      //this.bDateFromOptions.minDate = oldestBDate.toDate();
      this.bDateFromOptions.maxDate = today.toDate();
      this.bDateFromOptions.format = dateFormat;

    } else {
      this.bDateFromModel.momentObj = oldestBDate;
      this.bDateFromModel.formatted = oldestBDate.format(dateFormat);
    }

    if (this.bDateToOptions == null) {
      this.bDateToModel = new DateModel();
      this.bDateToModel.momentObj = today;
      this.bDateToOptions = new DatePickerOptions();
      this.bDateToOptions.initialDate = today.toDate();
      // this.bDateToOptions.minDate = oldestBDate.toDate();        
      this.bDateToOptions.maxDate = today.toDate();
      this.bDateToOptions.format = dateFormat;

    } else {
      this.bDateToModel.momentObj = today;
      this.bDateToModel.formatted = today.format(dateFormat);
    }

    let lastDayOfYear = new moment();
    lastDayOfYear.dayOfYear(365);

    let firstDayOfYear = new moment();
    firstDayOfYear.dayOfYear(1);

    if (this.bDayFromOptions == null) {
      this.bDayFromModel = new DateModel();
      this.bDayFromModel.momentObj = firstDayOfYear;
      this.bDayFromOptions = new DatePickerOptions();
      this.bDayFromOptions.initialDate = firstDayOfYear.toDate();
      this.bDayFromOptions.maxDate = lastDayOfYear.toDate();
      this.bDayFromOptions.minDate = firstDayOfYear.toDate();
      this.bDayFromOptions.format = noYearDateFormat;

    } else {
      this.bDayFromModel.momentObj = firstDayOfYear;
      this.bDayFromModel.formatted = firstDayOfYear.format(noYearDateFormat);
    }

    if (this.bDayToOptions == null) {
      this.bDayToModel = new DateModel();
      this.bDayToModel.momentObj = lastDayOfYear;
      this.bDayToOptions = new DatePickerOptions();
      this.bDayToOptions.initialDate = lastDayOfYear.toDate();
      this.bDayToOptions.maxDate = lastDayOfYear.toDate();
      this.bDayToOptions.minDate = firstDayOfYear.toDate();
      this.bDayToOptions.format = noYearDateFormat;

    } else {
      this.bDayToModel.momentObj = lastDayOfYear;
      this.bDayToModel.formatted = lastDayOfYear.format(noYearDateFormat);
    }




    /*
        this.userQuery.bDateFrom = oldestBDate;
        this.userQuery.bDateTo = new moment();
    
        let lastDayOfYear = new moment();
        lastDayOfYear.dayOfYear(365);
        this.userQuery.bDayTo = lastDayOfYear;
    
        let bDayFrom = new moment();
        bDayFrom.dayOfYear(1);
        this.userQuery.bDayFrom = bDayFrom;
        */

  }

  ngOnInit() {

    this.userQuery = new UserQuery();
    //this.getUserList();
    this.getGenderList();
    this.getMaritalStatusList();
    this.getOccupationList();
    this.getCityList();
    this.getStatusList();
    this.getTransportationList();

    this.userQuery.nbChildren = 0;
    this.userQuery.nbChildrenLimit = "At least";

    this.initDates();


    this.userListForm = new FormGroup({
      fromDate: new FormControl('', null),
      toDate: new FormControl('', null),
      fromBirthday: new FormControl('', null),
      toBirthday: new FormControl('', null),
      lname: new FormControl('', null),
      fname: new FormControl('', null),
      exclude: new FormControl('', null),
    });
  }

  onGoBack() {
    window.history.back();
  }
}


