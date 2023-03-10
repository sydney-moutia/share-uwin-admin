export interface GiftVoucherCode {
  id: string;
  shopId: string;
  posId: string | undefined;
  uid: string;
  used: boolean;
  usedAt: number;
}
