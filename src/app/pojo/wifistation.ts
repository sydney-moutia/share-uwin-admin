export class WifiStation {
  id: string;
  macAddress : string;
  pwd : string;
  usageText : string;
  open : boolean = false;
  usageLimit : number;
}