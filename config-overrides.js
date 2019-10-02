/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs-extra");
const path = require("path");
const RewireReactHotLoader = require("react-app-rewire-hot-loader");
const WriteFilePlugin = require("write-file-webpack-plugin");

const ASSET_DIR = "./public";
const WEBPACK_BUILD_DIR = "./build";
const WEBPACK_DEV_SERVER_URL = `http://localhost:${process.env.PORT || 3000}`;

module.exports = function override(config, env) {
  if (process.env.NODE_ENV !== "development") {
    return config;
  }

  config = RewireReactHotLoader(config, env);

  // Replace `react-dev-utils/webpackHotDevClient` with stock client due to an
  // unresolved issue that's preventing web extensions from connecting to the
  // dev server. (https://github.com/facebook/create-react-app/issues/4468)
  if (config.entry[0].includes("react-dev-utils/webpackHotDevClient")) {
    // Use resource query to configure `webpack-dev-server/client` to use the
    // our URL when establishing the socket connection to the dev server.
    const __resourceQuery = `?${WEBPACK_DEV_SERVER_URL}`;
    config.entry.splice(
      0,
      1,
      require.resolve("webpack-dev-server/client") + __resourceQuery,
      require.resolve("webpack/hot/dev-server") + __resourceQuery
    );
  }

  // Use `react-hot-loader`'s version of `react-dom`
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-dom": "@hot-loader/react-dom"
  };

  // Write hot reloading changes to disk for the browser to detect the changes.
  // See https://www.rubberduck.io/blog/browser-extensions-react
  config.output.path = path.join(__dirname, WEBPACK_BUILD_DIR);
  config.plugins.push(new WriteFilePlugin());
  fs.removeSync(WEBPACK_BUILD_DIR);
  fs.copySync(`${ASSET_DIR}/`, WEBPACK_BUILD_DIR, {
    filter: src => {
      const filename = path.basename(src);
      if (filename.match(/manifest(\.[a-z]+)?.json/)) {
        return filename === "manifest.development.json";
      }
      return true;
    }
  });
  fs.renameSync(
    `${WEBPACK_BUILD_DIR}/manifest.development.json`,
    `${WEBPACK_BUILD_DIR}/manifest.json`
  );

  return config;
};
