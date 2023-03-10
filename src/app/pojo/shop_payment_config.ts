export interface ShopPaymentConfig {
    shopId: string;
    gateway: string;
    enabled: boolean;
    merchantId?: string;
    merchantDisplayName?: string;
    merchaingUsername?: string;
    merchantApiPassword?: string;
}