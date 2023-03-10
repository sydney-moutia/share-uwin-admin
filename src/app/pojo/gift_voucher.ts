interface GiftVoucher {
    id: FirestoreString;
    amount: FirestoreInteger;
    billingUser: FirestoreString;
    createdAt: FirestoreInteger;
    expiredAt: FirestoreInteger;
    fromUser: FirestoreString;
    name: FirestoreString;
    paymentData?: FirestoreString;
    photoPath: FirestoreString;
    shopId: FirestoreString;
    shopName: FirestoreString;
    toUser: FirestoreString;
}