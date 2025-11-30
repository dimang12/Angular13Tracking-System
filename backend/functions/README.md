Setup & deploy

1. Install dependencies (run in backend/functions):

   npm install

2. Set your OpenAI key (do NOT commit key to repo):

   firebase functions:config:set openai.key="YOUR_OPENAI_KEY"

3. Deploy functions:

   firebase deploy --only functions:improveWithOpenAI

Usage (client-side - Angular)

Use @angular/fire Functions and a small service that calls the callable function. Ensure the user is authenticated before calling the function (the function checks for auth).

Security

- Keep keys out of source. Use `functions.config()` or Secret Manager.
- Consider adding per-user or per-IP rate limiting for production.

