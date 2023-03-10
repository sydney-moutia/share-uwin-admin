import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserShopLoyaltyPoint } from '../pojo/user_shop_loyalty_point';
import { ActivatedRoute } from '@angular/router';
import { LoyaltyPointService } from '../service/loyalty-point.service';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-loyalty-points-list',
  templateUrl: './loyalty-points-list.component.html',
  styleUrls: ['./loyalty-points-list.component.css'],
  providers: [LoyaltyPointService],
})
export class LoyaltyPointsListComponent implements OnInit {
  msgs: Message[] = [];
  shopName: string;
  userLoyaltyPoints: UserShopLoyaltyPoint[];
  userLoyaltyPoints$: Observable<UserShopLoyaltyPoint[]>;
  showPreloader = true;

  constructor(
    private route: ActivatedRoute,
    private loyaltyPointService: LoyaltyPointService,
  ) { }

  ngOnInit() {
    this.shopName = localStorage.getItem('shop_name');
    this.userLoyaltyPoints$ = this.route.params
      .switchMap(params => this.loyaltyPointService.cgetWhereShop(params['id']))
      .map(userLoyaltyPoints => {
        this.userLoyaltyPoints = userLoyaltyPoints;
        this.showPreloader = false;

        return userLoyaltyPoints;
      });
  }
}
