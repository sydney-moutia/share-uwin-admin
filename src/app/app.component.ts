import { Component } from '@angular/core';
import { AuthService } from './service/auth.service'

@Component({
  //moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [AuthService]
})

export class AppComponent {
  title = 'uWin Shop Administration';

  constructor(
    private authService: AuthService) {
}


  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }
}
