import { User } from '../pojo/user';

export class FlashSell {
  id: string = null;
  name: string;
  photoPath: string;
  discountValue: number;
  idItem: string=null;
  nameItem: string;
  priceItem: number;
  description: string;
  running : boolean;
  state : string;
  frequencyId : number;
  frequencyMaxSales : number;
  remainingNbSales : number;
  idShop: string;
}

export class FlashSellUsage extends User {
  flashSellUsageDate: number;
}