import { Person } from '../pojo/person';
import * as moment_ from 'moment';

const moment: any = (<any>moment_).default || moment_;

export class Voucher {
  id: string;
  idInitiator: string;
  fullnameInitiator: string;
  nbBeneficiaries: number;
  validityDate: number = moment().valueOf();
  voucherValue: number = 0;
  name: string;
  idShop: string;
  shopName?: string;
  useVoucherCode: boolean;
  useSingleVoucherCode: boolean;
  singleVoucherCode: string | null;

  constructor() { }
}

export class VoucherUsage extends Person {
  usedDate: number;
  payDate: number;
}
