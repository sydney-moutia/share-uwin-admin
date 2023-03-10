import { Component, OnInit, Input, OnChanges, SimpleChanges, Output,EventEmitter} from '@angular/core';
import { User } from '../pojo/user';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['user-detail.component.css'],
  providers: [User],
})


export class UserDetailComponent implements OnInit, OnChanges {
  @Input() user: User;

  constructor( ) { }

  ngOnInit() {

  }

  getQRPath() {
    return environment.restServer + "/users/" + this.user.id + "/qr";
  }



  ngOnChanges(changes: SimpleChanges) {

    if (changes['user'] != undefined) {
      let changedItem = changes['user'].currentValue;
      if (changedItem != undefined && changedItem.id != null) {
          
      }
     
    }
  }  

}
