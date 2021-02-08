Serverless Demo
===============

This project is intended to illustrate how Serverless Functions (part of CMS Hub Enterprise) could be used elsewhere in the HubSpot product.

This demo relies on two different HubSpot accounts:

1. A developer account that is used to create an installable app with a webhook and CRM card
2. A CMS Hub sandbox or CMS Hub Enterprise account, which is where the code will live and be executed. The two separate accounts are necessary because the Developer Account doesn't include the CMS developer file system and the CMS Hub accounts don't support app creation and management.

## Getting started

1. Clone this repo
2. Run `npm install`. This step installs the CLI local to this project as well as some other tooling like `prettier` and `eslint` that improves the quality of life for a JavaScript developer.
3. Using the CMS Sandbox Account or an account with CMS Hub Enterprise, run `npx hs init` to configure the CLI so that it can access the account.
4. Run `npm run deploy` to deploy the code in the `src` directory to the CMS Hub account. You can verify this by running `npx hs open design-manager` and looking for the `serverles-demo` folder in the sidebar.
5. Switch over to the developer account and create a new app. The app will need at least "contacts" in the set of scopes.

### Setting up the webhook (contact phone number formatter)

1. Using a domain from your CMS Sandbox Account construct the URL of the `/_hcms/api/webhook` endpoint and set it as the webhook URL. It will be something like `https://1724875.hs-sites.com/_hcms/api/webhook`. To find the domain, go to "Domains & URLs" in the website settings and show "Display system domains" in the "Advanced options."
2. Add the API key for the CMS sandbox to the secrets that are available to serverless functions running in the account going into settings to create the API key and then running `npx hs secrets add APIKEY` and pasting it.
3. Add the client secret for the app that you created as a secret using `npx hs secrets add CLIENT_SECRET`.
2. Create a subscription and subscribe to created contacts
3. Run `npx hs logs webhook --tail` to wait for new logs
4. Click the "Test" button to initiate a request to the webhook.

### Setting up the CRM Card (current weather for contact)

1. Create a CRM card for your app named "Weather card."
2. Set the "Data fetch url" to the `/_hcms/api/weather-card` API endpoint using the same domain you used when setting up the webhook. It should be something like `https://1724875.hs-sites.com/_hcms/api/weather-card`.
3. Add secret to access the [OpenWeather](https://openweathermap.org/) API. To simplify things, you can use `e357165f2f9230ed4feea06fafab15dd`. To do this, run `npx hs secrets add OPENWEATHER_API_KEY` and paste the secret in.
4. Create property for each data point: `temperature`, `feelsLike`, `humidity`, `high`, `low`, `weatherTypes`.

### Setting up a somewhat hacky OAuth flow for app install

1. Using `npx hs secrets add <secretName>`, add secrets for `CLIENT_ID` and `CLIENT_SECRET`.
2. Set the `redirect_uri` to the `/_hcms/api/oauth/code` API endpoint using the same domain as used previously. It should be something like `https://1724875.hs-sites.com/_hcms/api/oauth/code`
3. Run `npm run dev` and edit `src/demo.functions/auth.js` to modify the `REDIRECT_URI` variable to use the same URL as in step 2.
4. Copy the install URL for the app, paste into your web browser, and install to a test portal that you have available. You can use the CMS Sandbox Account for this if you would like.


## How does this work?

For more info on the CMS implementation of Server Functions, see [Serverless Developer Docs](https://developers.hubspot.com/docs/cms/features/serverless-functions), [Serverless Getting Started](https://developers.hubspot.com/docs/cms/guides/getting-started-with-serverless-functions), and [Serverless Technical Architecture](https://product.hubteam.com/docs/content/developer-assets/ServerlessFunctions.html).
