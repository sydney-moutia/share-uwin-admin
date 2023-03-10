import { Component, OnInit, EventEmitter, Input, Output, OnChanges, ViewChild, SimpleChanges, } from '@angular/core';
import { Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from '../service/survey.service';
import { OdkSurveyService } from '../service/odksurvey.service';
import { Survey } from '../pojo/survey';
import { User } from '../pojo/user';
import { OdkSurvey } from '../pojo/odkSurvey';
import { Message } from 'primeng/primeng';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { UtilsService } from '../service/utils.service'
import { FileUploadModule, FileUpload } from 'primeng/primeng';
import { environment } from '../../environments/environment';

import * as moment_ from 'moment';
const moment: any = (<any>moment_).default || moment_;

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.css'],
  providers: [SurveyService, OdkSurveyService],
})
export class SurveyDetailComponent implements OnInit {
  @Input()  survey: Survey;
  @Input()  surveyList: Survey[];
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();

  @ViewChild('aFileUpload') set content(content: FileUpload) {
    this.myFileUpload = content;
  }

  myFileUpload: FileUpload;

  userformSurvey: FormGroup;

  availableOdkSurveys: OdkSurvey[] = [];

  msgs: Message[] = [];

  odkSurveys: OdkSurvey[];

  // availableItems: Item[] = [];

  surveyCopy: Survey = new Survey();

  surveyDistResult: any;
  role: string;

  userList: User[] = [];

  deadlineOptions: DatePickerOptions;
  deadlineModel  : DateModel;

  initialized: boolean = false;

  constructor(
    private surveyService: SurveyService,
    private odkSurveyService: OdkSurveyService

  ) { }

  getOdkSurveys(): void {
    this.odkSurveyService.getSurveys().subscribe(
      odkSurveys => {
        this.odkSurveys = odkSurveys;
        // reduce list of surveys to the ones that are not already used in uwin surveys
        if (this.odkSurveys != undefined && this.odkSurveys != null) this.calcAvailableOdkSurveys ()
      },
      error => this.msgs.push({ severity: 'error', summary: 'Item List', detail: error })
    );
  }

  ngOnInit() {
     if (!this.initialized) {

      this.role = localStorage.getItem('auth_role');

      this.getOdkSurveys();

      this.userformSurvey = new FormGroup({
        odkId: new FormControl('', Validators.required),
       // odkName: new FormControl('', null),
        deadline: new FormControl('', Validators.required),
        upgradeOnCompletion: new FormControl('', null),
        downgradeOnNoCompletion: new FormControl('', null)

      });

      this.deadlineModel = new DateModel();
      this.deadlineOptions = new DatePickerOptions();
      this.deadlineOptions.format = "DD/MM/YYYY";

      this.initialized = true;
    }
  }

   onOdkSurveyChange(odkId: string) {

    let seletectedOdkSurvey = this.odkSurveys.find(element => element.odkId === odkId);

    if (seletectedOdkSurvey != null) {
      this.survey.odkId = seletectedOdkSurvey.odkId;
      this.survey.odkName = seletectedOdkSurvey.odkName;
      this.userformSurvey.updateValueAndValidity();
    }

    this.userformSurvey.markAsDirty();

  }

  doCancel (target : Survey) {
    UtilsService.copyInto(this.surveyCopy, target);
    this.deadlineModel.momentObj = new moment(target.deadline);
    this.deadlineModel.formatted = this.deadlineModel.momentObj.format("DD/MM/YYYY");
    this.userformSurvey.markAsPristine();
  }

  onSubmit() {
    this.msgs = [];

    let newItem = (this.survey.id === null);

    this.survey.deadline = this.deadlineModel.momentObj.valueOf();
    

    this.surveyService.createOrUpdateSurvey(this.survey)
      .subscribe(

      id => {
        this.survey.id = id;
        this.saved.emit(this.survey);
        this.msgs.push({ severity: 'info', summary: 'Saving Survey', detail: 'OK' });
        if (this.myFileUpload) this.myFileUpload.url = environment.restServer + "/admin/surveys/" + this.survey.id + "/uploadUserFile";
        this.userformSurvey.markAsPristine();
      },

      error => this.msgs.push({ severity: 'error', summary: 'Saving Coupon', detail: error })
      );
  }  

  onDelete() {
    if (this.survey !== null && this.survey.id !== null)
      this.surveyService.deleteSurvey(this.survey).subscribe(
        response => {
          if (response === "ok") {
            this.deleted.emit(this.survey);
            this.survey = null;
          }
        },

        error => this.msgs.push({ severity: 'error', summary: 'Deleting Survey', detail: error })
      );
  }

  onCancel() {
    this.doCancel(this.survey);
  }


    calcAvailableOdkSurveys () {
        if (this.surveyList != undefined) {

          let tmp: OdkSurvey[] = this.odkSurveys.slice();
          let xsurvey: OdkSurvey;

          for (let i = 0; i < this.surveyList.length; i++) {
            xsurvey = tmp.find(elem => elem.odkId === this.surveyList[i].odkId);
            if (xsurvey != null && this.survey !=null && xsurvey.odkId != this.survey.odkId) {
              // remove item from list
              let indx = tmp.findIndex(ex => ex.odkId === xsurvey.odkId);
              tmp.splice(indx, 1);
            }
          }

          this.availableOdkSurveys = tmp;


        }
  }

 ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();

                    // reduce list of surveys to the ones that are not already used in uwin surveys
        if (this.odkSurveys != undefined && this.odkSurveys != null) this.calcAvailableOdkSurveys ()


    if (this.myFileUpload) {
      this.myFileUpload.clear();
    }
    this.surveyDistResult = [];

    if (changes['survey'] != undefined) {

      if (!this.userformSurvey.pristine) {
        this.doCancel(changes['survey'].previousValue);
      }

      let changedSurvey = changes['survey'].currentValue;
      if (changedSurvey != undefined && changedSurvey.id != null) {
          UtilsService.copyInto(this.survey, this.surveyCopy);

          if (this.myFileUpload) this.myFileUpload.url = environment.restServer + "/admin/surveys/" + this.survey.id + "/uploadUserFile";

          this.deadlineModel.momentObj = new moment(this.survey.deadline);
          this.deadlineModel.formatted = this.deadlineModel.momentObj.format("DD/MM/YYYY");

          //this.getUsers(this.voucher.idShop, this.voucher.id);

        } else {
          this.deadlineModel.momentObj = null;
          this.deadlineModel.formatted = "";
          this.userList = [];

          //this.voucherUsageList = [];
          //this.enableFormControls(true);
        }

      
    } 

  if (this.survey != undefined) this.getUsers(this.survey);

  }

   fileUserPrepSendRequest(event) {
    let authToken = localStorage.getItem('auth_token');
    if (authToken !== undefined) event.xhr.setRequestHeader("Authorization", authToken);

  }

  fileUserUploaded(event) {

    let result = JSON.parse(event.xhr.response);

    this.surveyDistResult = result.response;

    this.getUsers(this.survey);


    this.msgs.push({ severity: 'info', summary: 'File upload success', detail: '' });
  }

  fileUserUploadError(event) {
    this.msgs.push({ severity: 'error', summary: 'File upload error', detail: '' });
  }

  fileUserUploadSelect(event) {
    this.surveyDistResult = [];
  }

  enableControls(enable: boolean): void {
    if (enable) {
      this.userformSurvey.get('odkId').enable();
      this.userformSurvey.get('upgradeOnCompletion').enable();
      this.userformSurvey.get('downgradeOnNoCompletion').enable();


    } else {
      this.userformSurvey.get('odkId').disable();
      this.userformSurvey.get('upgradeOnCompletion').disable();
      this.userformSurvey.get('downgradeOnNoCompletion').disable();
    }
  }

  getUsers(survey: Survey): void {
    if (survey === null || survey.id === null) {
      this.userList = [];
      this.enableControls(true);
    }
    else {
      this.surveyService.getSurveyUsers(survey).subscribe(
        users => {
          this.userList = users;
          this.enableControls(users.length == 0);
        },
        error => this.msgs.push({ severity: 'error', summary: 'User List', detail: error })
      );
    }
  }

}
