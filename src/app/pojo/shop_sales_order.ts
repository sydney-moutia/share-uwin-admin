export type PaymentState = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface ShopSalesOrderVouchers { [key: string]: number; };

export interface ShopSalesOrder {
    shopId: string,
    userId: string,
    shopName?: string,
    createdAt: number,
    createdAtFormatted?: string,
    sendTransactionMailAt?: number,
    id: string,
    total: number,
    totalFormatted?: string,
    items: ShopSalesOrderItem[],
    shippingDetails: ShippingDetails,
    shippingLabel: string,
    shippingCost: number,
    shippingCostFormatted?: string,
    paymentState?: PaymentState,
    paymentMethod?: 'mcb',
    paymentDetails?: { [key: string]: any },
    vouchers: ShopSalesOrderVouchers,
}

export interface ShopSalesOrderItem {
    productId: string,
    product: null,
    label: string,
    details: null,
    photoPath: string,
    quantity: number,
    unitPrice: number,
    total: number,
    totalFormatted?: string
}

export interface ShippingDetails {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    postCode: string
}