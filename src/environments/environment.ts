// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  // restServer: "https://192.168.1.20:8183",
  restServer: "https://u-win.shop",
  firebaseRestApi: "http://0.0.0.0:5000/uwin-201010/us-central1/restApi",
  visitMauritiusApi: "http://0.0.0.0:5001/visitmauritius-30aed/us-central1/adminApi",
  envName: 'dev',
  homeBannerId: 'home-dev',
  voucherCodeUploadEndpoint: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/vouchers/:voucherId/codes/uploads',
  voucherCodeListEndpoint: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/vouchers/:voucherId/codes',
  firebase: {
    apiKey: "AIzaSyARmJ-pptytfGb5lg2kQvfRUb7sLUBp6A0",
    customTokenEndpoint: 'https://us-central1-uwin-201010.cloudfunctions.net/adminAuth',
    signInWithCustomTokenEndpoint: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken',
    refreshTokenEndpoint: 'https://securetoken.googleapis.com/v1/token',
  },
  endpoints: {
    v2: {
      users: {
        export: 'http://localhost:3000/v2/users/export'
      }
    },
    notifications: {
      create: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/notifications',
      list: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/notifications',
    },
    vouchers: {
      welcomeVouchers: 'http://localhost:4000/admin/welcome-vouchers',
      list: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/vouchers',
      adminList: 'https://u-win.shop/admin/v2/vouchers',
      create: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/vouchers',
      update: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/vouchers/:voucherId',
      addSingleVoucherQuantity: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/vouchers/:voucherId/add-single-voucher-quantity',
      distributeToAll: 'http://localhost:4000/admin/vouchers/:voucherId/distribute-to-all',
    },
    vouchersGroup: {
      list: 'https://u-win.shop/admin/v2/vouchers-groups',
    },
    loyaltyPoints: {
      list: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/shops/:shopId/loyalty-points',
    },
    categories: {
      list: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/categories',
      upload: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/upload-categories',
      download: 'http://localhost:5000/uwin-201010/us-central1/restApi/v1/download-categories',
    },
    missions: 'http://192.168.40.103:4000',
  },
  // firebase: {
  //   apiKey: "AIzaSyARmJ-pptytfGb5lg2kQvfRUb7sLUBp6A0",
  //   customTokenEndpoint: 'http://localhost:5000/uwin-201010/us-central1/adminAuth',
  //   signInWithCustomTokenEndpoint: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken',
  //   refreshTokenEndpoint: 'https://securetoken.googleapis.com/v1/token',
  // },
};

// restServer: "http://192.168.100.10:8180",
