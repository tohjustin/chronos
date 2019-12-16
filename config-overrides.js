const fs = require("fs-extra");
const path = require("path");
const RewireReactHotLoader = require("react-app-rewire-hot-loader");
const WriteFilePlugin = require("write-file-webpack-plugin");

const WEBPACK_DEV_SERVER_URL = `http://localhost:${process.env.PORT || 3000}`;

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const paths = {
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public")
};

module.exports = function override(config, webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";

  if (isEnvDevelopment) {
    // Replace `react-dev-utils/webpackHotDevClient` with stock client due to an
    // unresolved issue that's preventing web extensions from connecting to the
    // dev server. (https://github.com/facebook/create-react-app/issues/4468)
    if (config.entry[0].includes("react-dev-utils/webpackHotDevClient")) {
      const __resourceQuery = `?${WEBPACK_DEV_SERVER_URL}`;

      config = RewireReactHotLoader(config, webpackEnv);
      // Use resource query to configure `webpack-dev-server/client` to use the
      // our URL when establishing the socket connection to the dev server.
      config.entry.splice(
        0,
        1,
        require.resolve("webpack-dev-server/client") + __resourceQuery,
        require.resolve("webpack/hot/dev-server") + __resourceQuery
      );
      // Use `react-hot-loader`'s version of `react-dom`
      config.resolve.alias = {
        ...config.resolve.alias,
        "react-dom": "@hot-loader/react-dom"
      };
    }

    // Write webpackDevServer output to disk to allow the application to be
    // installed temporary on browsers.
    // See https://www.rubberduck.io/blog/browser-extensions-react
    config.output.path = paths.appBuild;
    config.output.futureEmitAssets = false;
    config.plugins.push(new WriteFilePlugin());
    fs.removeSync(paths.appBuild);
    fs.copySync(paths.appPublic, paths.appBuild, {
      filter: src => {
        const filename = path.basename(src);
        if (filename.match(/manifest(\.[a-z]+)?.json/)) {
          return filename === "manifest.development.json";
        }
        return true;
      }
    });
    fs.renameSync(
      `${paths.appBuild}/manifest.development.json`,
      `${paths.appBuild}/manifest.json`
    );
  }

  return config;
};
