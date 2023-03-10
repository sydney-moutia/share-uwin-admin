import { City } from '../pojo/city';
import { WifiStation } from '../pojo/wifistation';

export class Pos {

  constructor() {
    this.id = null;
    this.city = new City(null,null,null);
    this.lat = -20.16099171617344;
    this.lng = 57.498106956481934;
  }

  id: string;
  name: string;
  description: string;
  city: City;
  lat: number;
  lng: number;
  address: string;
  tel: string;
  photoPath: string[];
  wifiStation: WifiStation;
  website: string;
}