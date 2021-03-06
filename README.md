<p align="center">
  <img src="./docs/title.png">
</p>

## About

[![CircleCI](https://circleci.com/gh/tohjustin/chronos/tree/master.svg?style=shield)](https://circleci.com/gh/tohjustin/chronos/tree/master)
[![Release](https://aegisbadges.appspot.com/static?subject=release&status=v1.1.1&color=379AF7)](https://github.com/tohjustin/chronos/releases)
[![License](https://aegisbadges.appspot.com/static?subject=license&status=MIT&color=379AF7)](https://opensource.org/licenses/MIT)

Chronos is a browser extension for recording & visualizing web browsing activity.

<p align="center">
  <img src="./docs/home-page.png">
</p>

### FAQ

#### Do you collect any data?

__Not at all!__ All recorded web browsing activity is stored locally on your device. The application is not connected to any external services & no data will be transmitted out of your device.

#### How can I export my data?

Users have the ability to export all recorded data or import data (backed-up from a different browser or machine) via the application's settings page.

#### What browsers are supported?

Here's the list of supported browsers:

* Brave & Chrome ([Chrome Web Store](https://chrome.google.com/webstore/detail/chronos/ihinclpfkgmmabjjmkldhegakmdhdcio))
* Edge Chromium ([Edge Extension Store](https://microsoftedge.microsoft.com/addons/detail/lojilcmafodjobdcannaljdllkliofpo))
* Firefox ([Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/chronos-app))
* Opera (under Opera Add-ons review)

[//]: # (TODO: How do I request a feature?)

## Getting Started

### Table of Contents

* [Overview](#overview)
* [Development Workflow](#development-workflow)
  * [Debugging the background page](#debugging-the-background-page)
  * [Debugging the extension page](#debugging-the-extension-page)
    * [React DevTools](#react-devtools)
    * [Redux DevTools](#redux-devtools)
* [Linting & Testing](#linting-&-testing)
  * [Static Checking & Linting](#static-checking-&-linting)
  * [Unit Testing](#unit-testing)
* [Packaging](#packaging)
  * [Extension](#extension)
  * [Extension Demo (Web Application)](#extension-demo-web-application)

### Overview

The application consists of two main components:

* __Background Page__: A script (a.k.a `ActivityLogger`) that runs in the background & listens to browser tab events to record web browsing activity into the browser's client-side storage ([IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)).
* __Extension Page__: A web application that visualizes the user's web browsing activity by using the data stored in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) by the background page.

### Development Workflow

The recommended way to develop the application is to temporarily install the extension on your browser with the following steps:

1. Start the application's `webpack-dev-server`:

    ```bash
    yarn start
    ```

2. Go to the browser's extension management page:

    * __Brave__: [brave://extensions](brave://extensions)
    * __Chrome__: [chrome://extensions](chrome://extensions)
    * __Firefox__: [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
    * __Opera__: [opera://extensions](opera://extensions)

3. Temporarily install the extension (select `manifest.json` found in `/build`):

    > NOTE: Depending on the browser platform, you might be required to enable "Developer mode".

    * __Brave__/__Chrome__/__Opera__: Click on the _"Load Unpacked"_ button located at the top of the page
    * __Firefox__: Click on the _"Load Temporary Add-on..."_ button located at the top of the page

4. Once installed successfully, you should see the `chronos`'s icon in your browser's navigation bar. Click on it to navigate to `chronos`'s extension page.

5. You can start modifying the codebase & observe the changes right away without having to reinstall the extension (i.e. hot-reloading should work out of the box).

#### Debugging the background page

1. Go to the browser's extension management page

2. To open the DevTools panel of the extension's background page:

    * __Brave__/__Chrome__/__Opera__: Click on _"index.html"_ link located on the extension's details card
    * __Firefox__: Click on _"Inspect"_ button located on the extension's details card

#### Debugging the extension page

To get development tools such as [react-devtools](https://github.com/facebook/react/tree/master/packages/react-devtools) & [redux-devtools](https://github.com/reduxjs/redux-devtools) to work against a temporarily installed extension, start the application's `webpack-dev-server` in remote debug mode:

```bash
yarn start:remote-debug
```

##### React DevTools

1. Start `react-devtools` server on `http://localhost:8097` (you should observe the `react-devtools` UI being opened in a new window)

    ```bash
    yarn react-devtools
    ```

2. Reload the extension page, the application should automatically connect to the `react-devtools` server & UI.

##### Redux DevTools

1. Start `redux-devtools` server on `http://localhost:8098`

    ```bash
    yarn redux-devtools
    ```

2. Open the Remote `redux-devtools` UI by clicking on the `redux-devtools` extension icon in your browser window & selecting the _"Open Remote DevTools"_ option on the dropdown

3. If this is your first time using the tool, go to the `redux-devtools` UI settings & ensure that:
    * _"Use custom (local) server"_ is checked
    * _"Host name"_ & _"Port"_ field is set to `locahost` & `8098` respectively
    * _"Use secure connection"_ option is unchecked

4. Reload the extension page, the application should automatically connect to the `redux-devtools` server & UI.

### Linting & Testing

#### Static Checking & Linting

Run `tsc`, [ESLint](https://eslint.org/), [stylelint](https://stylelint.io/) & [Prettier](https://prettier.io/)

```shell
yarn run check
```

Fix [ESLint](https://eslint.org/) all fixable errors & warnings

```shell
yarn lint:fix
```

Fix [stylelint](https://stylelint.io/) all fixable errors & warnings

```shell
yarn stylelint:fix
```

Fix [Prettier](https://prettier.io/) all fixable errors & warnings

```shell
yarn prettier:fix
```

#### Unit Testing

Run all unit tests & watch for changes

```shell
yarn test
```

Run all unit tests & enable [Node Debugger](https://nodejs.org/docs/latest-v12.x/api/debugger.html)

```shell
yarn test:debug
```

Run all unit tests

```shell
yarn test:ci
```

### Packaging

#### Extension

Build the extension & output bundle into `/build` & a zip file `build-<GIT_COMMIT_SHA>.zip` which can be used across all supported browsers.

```shell
yarn build:extension
```

#### Extension Demo (Web Application)

> __NOTE__: Make sure you have created `.env` before proceeding
>
> * see [.env.example](./.env.example) for list of environment variables to populate

For demo purposes, we can build the extension as a web application that has the extension's UI, populated with pre-generated web browsing activity data.

Build the extension as a demo web application & output bundle into `/build`

```shell
yarn build:demo
```

## License

Chronos is [MIT licensed](./LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftohjustin%2Fchronos.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftohjustin%2Fchronos?ref=badge_large)
