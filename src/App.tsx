/** @jsx jsx */

import { jsx, Global, css } from "@emotion/core";
// import { ThemeProvider } from "emotion-theming";
import { ConnectedRouter } from "connected-react-router";
import React, { Component } from "react";
import { BarChart2, DownloadCloud, Settings } from "react-feather";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { Switch, Route } from "react-router";
import { HashRouter } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import store, { history } from "./store";
import emotionReset from "./styles/reset";
import AnalyticsView from "./views/analytics";
import SettingsView from "./views/settings";
import ExportView from "./views/export";

import "./App.css";
import logo from "./logo.svg";

const DefaultView = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

class App extends Component<{}, {}> {
  render() {
    return (
      <div>
        <Global
          styles={css`
            ${emotionReset}

            body {
              font-family: Open Sans;
              font-weight: 600;
              font-size: 10px;
            }
          `}
        />
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <HashRouter basename="">
              <Sidebar
                primaryItems={[
                  {
                    featherIcon: BarChart2,
                    text: "Analytics",
                    to: "/analytics"
                  }
                ]}
                secondaryItems={[
                  {
                    featherIcon: DownloadCloud,
                    text: "Export",
                    to: "/export"
                  },
                  {
                    featherIcon: Settings,
                    text: "Settings",
                    to: "/settings"
                  }
                ]}
              />
              <Switch>
                <Route path="/analytics" component={AnalyticsView} />
                <Route path="/export" component={ExportView} />
                <Route path="/settings" component={SettingsView} />
                <Route component={DefaultView} />
              </Switch>
            </HashRouter>
          </ConnectedRouter>
        </Provider>
      </div>
    );
  }
}

export default (process.env.NODE_ENV === "development"
  ? hot(module)(App)
  : App);
