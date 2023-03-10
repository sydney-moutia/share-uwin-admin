import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { of } from 'rxjs/observable/of';
import { Shop } from '../pojo/shop';
import { ShopService } from './shop.service';
import { combineLatest } from 'rxjs/operators';

const _apiEndpoint = 'https://firestore.googleapis.com/v1/projects/uwin-201010/databases/(default)/documents/shopExt';

@Injectable()
export class ShopExtService {
    constructor(private http: Http, private authService: AuthService) { }

    create(): ShopExt {
        return {
            id: {
                stringValue: '',
            },
            adult: {
                booleanValue: false,
            },
            brn: {
                stringValue: '',
            },
            vatNumber: {
                stringValue: '',
            },
            tradeName: {
                stringValue: '',
            },
            plan: {
                stringValue: '',
            },
            hasLoyalty: {
                booleanValue: false,
            },
            currencyAmount: {
                integerValue: 0,
            },
            pointAmount: {
                integerValue: 0,
            },
            loyaltyShopId: {
                stringValue: '',
            },
            logisticProviders: {
                mapValue: {
                    fields: {}
                }
            },
            freeShippingEnabled: {
                booleanValue: false,
            },
            freeShippingThreshold: {
                integerValue: 0,
            },
            handlingFeeAmount: {
                integerValue: 0,
            },
            handlingFeeEnabled: {
                booleanValue: false,
            },
            noHandlingFeeThreshold: {
                integerValue: 0,
            },
            noHandlingFeeEnabled: {
                booleanValue: false,
            },
            onlineCatalogButton: {
                booleanValue: false,
            },
            buyNowButton: {
                booleanValue: false,
            },
            catalogButton: {
                booleanValue: false,
            },
            isFeatured: {
                booleanValue: false,
            },
            mainCategories: {
              mapValue: { fields: {} }
            },
            tabs: undefined,
        };
    }

    find(id: string): Observable<ShopExt> {
        return this.authService
            .getFirestoreToken()
            .switchMap(token => this.http.get(
                `${_apiEndpoint}/${id}`,
                { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
            )
            .map(res => res.json().fields as ShopExt)
            .map(shopExt => {
                if (!shopExt.logisticProviders) {
                    shopExt.logisticProviders = {
                        mapValue: {
                            fields: {}
                        }
                    };
                }

                if (!shopExt.hasLoyalty) {
                    shopExt.hasLoyalty = {
                        booleanValue: false,
                    } as FirestoreBoolean;
                }
                if (!shopExt.currencyAmount) {
                    shopExt.currencyAmount = {
                        integerValue: 0,
                    } as FirestoreInteger;
                }
                if (!shopExt.pointAmount) {
                    shopExt.pointAmount = {
                        integerValue: 0,
                    } as FirestoreInteger;
                }
                if (!shopExt.loyaltyShopId) {
                    shopExt.loyaltyShopId = {
                        stringValue: '',
                    } as FirestoreString;
                }
                if (!shopExt.freeShippingEnabled) {
                    shopExt.freeShippingEnabled = { booleanValue: false };
                }
                if (!shopExt.freeShippingThreshold) {
                    shopExt.freeShippingThreshold = { integerValue: 0 }
                }
                if (!shopExt.handlingFeeEnabled) {
                    shopExt.handlingFeeEnabled = { booleanValue: false }
                }
                if (!shopExt.handlingFeeAmount) {
                    shopExt.handlingFeeAmount = { integerValue: 0 }
                }
                if (!shopExt.noHandlingFeeEnabled) {
                    shopExt.noHandlingFeeEnabled = { booleanValue: false };
                }
                if (!shopExt.noHandlingFeeThreshold) {
                    shopExt.noHandlingFeeThreshold = { integerValue: 0 }
                }

                return shopExt;
            })
            .catch(err => {
                if (err.status === 404) {
                    return of({
                        id: {
                            stringValue: id
                        },
                        adult: {
                            booleanValue: false
                        },
                        brn: {
                            stringValue: ''
                        },
                        vatNumber: {
                            stringValue: ''
                        },
                        tradeName: {
                            stringValue: ''
                        },
                        plan: {
                            stringValue: 'STARTER'
                        },
                        hasLoyalty: {
                            booleanValue: false,
                        },
                        currencyAmount: {
                            integerValue: 0,
                        },
                        pointAmount: {
                            integerValue: 0,
                        },
                        loyaltyShopId: {
                            stringValue: '',
                        },
                        logisticProviders: {
                            mapValue: {
                                fields: {}
                            }
                        },
                        freeShippingEnabled: {
                            booleanValue: false,
                        },
                        freeShippingThreshold: {
                            integerValue: 0,
                        },
                        handlingFeeAmount: {
                            integerValue: 0,
                        },
                        handlingFeeEnabled: {
                            booleanValue: false,
                        },
                        noHandlingFeeThreshold: {
                            integerValue: 0,
                        },
                        noHandlingFeeEnabled: {
                            booleanValue: false,
                        },
                    } as ShopExt);
                }

                return Observable.throw(err)
            });
    }

    save(shopExt: ShopExt): Observable<ShopExt> {
        return this.authService
            .getFirestoreToken()
            .switchMap(token => this.http.patch(
                `${_apiEndpoint}/${shopExt.id.stringValue}`,
                { fields: shopExt },
                { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
            )
            .map(res => res.json().fields as ShopExt);
    }
}
