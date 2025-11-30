// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDkWdhOaQ7MT8e7ZdDwPqQiuTJNYXVCi6I",
    authDomain: "tracking-c85a8.firebaseapp.com",
    projectId: "tracking-c85a8",
    storageBucket: "tracking-c85a8.firebasestorage.app",
    messagingSenderId: "235757649576",
    appId: "1:235757649576:web:ea3426c24bb86295a98c9d",
    measurementId: "G-6S16EV9Y48"
  },
  // For local development only: if you need to call OpenAI directly from the client use a test key here
  // but DO NOT commit production keys. Prefer using the Functions proxy configured via
  // `firebase functions:config:set openai.key="YOUR_KEY"` and call the callable function.
  openaiApiKey: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
