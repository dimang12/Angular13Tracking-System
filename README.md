# TrackingSystem13

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

### OpenAI proxy function

A Firebase Cloud Function is provided at `backend/functions/index.js` named `improveWithOpenAI` that proxies requests to the OpenAI Chat Completions API. It requires:

- Firebase Functions config: `firebase functions:config:set openai.key="YOUR_OPENAI_KEY"`
- Deployed function: `firebase deploy --only functions:improveWithOpenAI`

Client usage: call the callable endpoint from the client (an example service is `src/app/services/openai-proxy.service.ts`). The function requires the user to be authenticated.

Security: never store the OpenAI key in source control; use `functions.config()` or Secret Manager.
