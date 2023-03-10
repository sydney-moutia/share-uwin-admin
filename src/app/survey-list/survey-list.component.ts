import { Component, OnInit } from '@angular/core';

import { Survey } from '../pojo/survey';
import {Message} from 'primeng/primeng';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'
import { SurveyService } from '../service/survey.service'

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css'],
  providers: [SurveyService]
})
export class SurveyListComponent implements OnInit {
  error: any;
  surveys: Survey[];
  selectedSurvey: Survey;
  isAdmin : boolean;
  today: number;

   msgs: Message[] = [];

  constructor(
            private router: Router,
            private surveyService: SurveyService,
            private authService: AuthService) {
  }

  
  getSurveys(): void {
    this.surveyService.getSurveys().subscribe(
      surveys => this.surveys = surveys, 
      error =>  this.msgs.push({severity:'error', summary:'Survey List', detail:error})
    );  
  }
  
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.today = new Date().getTime();
    this.getSurveys();
  }


  onRowSelect (event) {
    this.selectedSurvey = event.data;
  }

    onNewSurvey() {
        this.selectedSurvey = new Survey();
    }    

 savedSurvey (survey : Survey): void {
    // update the survey list is a new voucher has been created
    let indx = this.surveys.findIndex(aSurvey => aSurvey === survey);

    if (indx<0) {
      this.surveys.push(survey);
    }

    this.selectedSurvey = survey;

  }

  deletedSurvey (survey: Survey) : void {
    // update the survey list if a voucher has been deleted
    let indx = this.surveys.findIndex(aSurvey => aSurvey === survey);

    if (indx>=0) {
      this.surveys.splice(indx, 1);
    }

    this.selectedSurvey = null;

  }


  onGoBack() {
    window.history.back();
  } 

}
