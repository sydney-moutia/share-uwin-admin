import { City } from '../pojo/city';
import { WifiStation } from '../pojo/wifistation';
import { StatusDiscount } from '../pojo/statusdiscount';
import { ShopType } from '../pojo/shopType';
import { Person } from '../pojo/person';

export class Shop {

  constructor() {
    this.id = null;
    // this.city = new City(null,null,null);
    this.shopType = new ShopType();
    this.statusDiscount = new StatusDiscount();
    // this.lat = -20.16099171617344;
    // this.lng = 57.498106956481934;
  }

  id: string;
  state: string;
  name: string;
  audience : string;
  // city: City;
  // lat: number;
  // lng: number;
  // address: string;
  // tel: string;
  photoPath: string[];
  // wifiStation: WifiStation;
  statusDiscount: StatusDiscount;
  shopType: ShopType;
  owner: Person;
  website: string;
}