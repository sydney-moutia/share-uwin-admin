interface ShopExt {
    id: FirestoreString;
    adult: FirestoreBoolean;
    brn: FirestoreString;
    vatNumber: FirestoreString;
    tradeName: FirestoreString;
    plan: FirestoreString;
    hasLoyalty: FirestoreBoolean;
    currencyAmount: FirestoreInteger;
    pointAmount: FirestoreInteger;
    loyaltyShopId: FirestoreString;
    logisticProviders: LogisticProvideMap;
    freeShippingEnabled: FirestoreBoolean;
    freeShippingThreshold: FirestoreInteger;
    handlingFeeEnabled: FirestoreBoolean;
    handlingFeeAmount: FirestoreInteger;
    noHandlingFeeEnabled: FirestoreBoolean;
    noHandlingFeeThreshold: FirestoreInteger;
    onlineCatalogButton: FirestoreBoolean;
    catalogButton: FirestoreBoolean;
    buyNowButton: FirestoreBoolean;
    isFeatured: FirestoreBoolean;
    mainCategories: { mapValue: { fields: { [key: string]: FirestoreBoolean } } };
    tabs: Tabs | undefined;
}

interface Tabs {
  arrayValue: {
    values: TabDetails[],
  }
}

interface TabDetails {
  mapValue: {
    fields: {
      content: FirestoreString;
      label: FirestoreString;
    }
  }
}

interface LogisticProvideMap {
    mapValue: LogisticProvideMapValue
}

interface LogisticProvideMapValue {
    fields: { [key: string]: FirestoreBoolean }
}

interface ShopExtData {
    id: string;
    adult: boolean;
    brn: string;
    vatNumber: string;
    tradeName: string;
    plan: string;
    hasLoyalty: boolean;
    currencyAmount: number;
    pointAmount: number;
    loyaltyShopId: string;
    logisticProviders: {[key: string]: boolean};
    freeShippingEnabled: boolean;
    freeShippingThreshold: number;
    handlingFeeEnabled: boolean;
    handlingFeeAmount: number;
    noHandlingFeeEnabled: boolean;
    noHandlingFeeThreshold: number;
    onlineCatalogButton: boolean;
    catalogButton: boolean;
    buyNowButton: boolean;
    isFeatured: boolean;
    mainCategories: { [key: string]: boolean }
}
