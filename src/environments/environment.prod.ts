export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDkWdhOaQ7MT8e7ZdDwPqQiuTJNYXVCi6I",
    authDomain: "tracking-c85a8.firebaseapp.com",
    projectId: "tracking-c85a8",
    storageBucket: "tracking-c85a8.firebasestorage.app",
    messagingSenderId: "235757649576",
    appId: "1:235757649576:web:ea3426c24bb86295a98c9d",
    measurementId: "G-6S16EV9Y48"
  },
  // OpenAI API key must NOT be committed to source. Leave empty in repo and set it on the server via
  // `firebase functions:config:set openai.key="YOUR_KEY"` or use Secret Manager.
  openaiApiKey: ''
};
