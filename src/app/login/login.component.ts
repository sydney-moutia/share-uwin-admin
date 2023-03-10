import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service'
import { ValidationService } from '../service/validation.service'
import { Shop } from '../pojo/shop';
import { Router } from '@angular/router';

import { Message } from 'primeng/primeng';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {
  error: any;
  userformLogin: FormGroup;
  email: string;// = "victoria.mendez@mainstreet17.com";
  pwd: string;// = "x";
  msgs: Message[] = [];
  showSpinner = false;

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.userformLogin = new FormGroup({
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      pwd: new FormControl('', [Validators.required])
    });
    this.authService.logout();
  }

  onSubmit() {
    this.showSpinner = true;
    this.authService.login(this.email, this.pwd)
      .subscribe((result) => {
        this.showSpinner = false;
        if (result) {
          let role = localStorage.getItem('auth_role');

          if (role === "ADMIN") {
            this.router.navigate(['menu']);
          } else if (role === "CASHIER") {
            this.msgs.push({ severity: 'warn', summary: 'Access error', detail: 'You are not allowed to access uWin Admin Console' })
          } else {
            this.router.navigate(['shops']);
          }
        }

      },
        error => {
          this.showSpinner = false;
          this.msgs.push({ severity: 'error', summary: 'Login', detail: error });
        }
      );
  }

}
