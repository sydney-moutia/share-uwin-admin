import { Component, OnInit,Input } from '@angular/core';
import { PosService } from '../service/pos.service'
import { AuthService } from '../service/auth.service'
import { Shop } from '../pojo/shop';
import { Pos } from '../pojo/pos';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {Message} from 'primeng/primeng';


@Component({
  //moduleId: module.id,
  selector: 'app-pos-list',
  templateUrl: 'pos-list.component.html',
  styleUrls: ['pos-list.component.css'],
  providers: [PosService]
})

export class PosListComponent implements OnInit {
  @Input() idShop: string;
  sub: any;
  error: any;
  posList: Pos[];
  selectedPos: Pos;
  isAdmin : boolean;
  shopName : string;

  msgs: Message[] = [];

  constructor(
            private router: Router,
            private posService: PosService,
            private authService: AuthService,
            private route: ActivatedRoute  ) {
  }


  getPosList(): void {
    this.posService.getPosList(this.idShop).subscribe(
      posList => this.posList = posList,
      error =>  this.msgs.push({severity:'error', summary:'Point of Sale List', detail:error})
    );  
  }
  
  ngOnInit() {
    this.isAdmin = this.authService.isDirector();
    if (!this.idShop) {
      this.sub = this.route.params.subscribe(params => {
        this.idShop = params['id'];
      });
    }

    this.shopName = localStorage.getItem('shop_name');

    this.getPosList();
  }

  onRowSelect(event) {
      this.selectedPos = event.data;
  }

  onNewPos() {
      this.selectedPos = new Pos();
  }    

  onGoBack() {
    window.history.back();
  } 

}
