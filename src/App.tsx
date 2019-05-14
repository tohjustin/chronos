import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { BarChart2, Settings } from "react-feather";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import store, { history } from "./store";
import AnalyticsView from "./views/analytics";
import SettingsView from "./views/settings";

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <HashRouter basename="">
        <div className="app-container">
          <Navbar
            primaryItems={[
              {
                featherIcon: BarChart2,
                text: "Analytics",
                to: "/analytics"
              }
            ]}
            secondaryItems={[
              {
                featherIcon: Settings,
                text: "Settings",
                to: "/settings"
              }
            ]}
          />
          <div className="view-container">
            <Switch>
              <Route path="/analytics" component={AnalyticsView} />
              <Route path="/settings" component={SettingsView} />
              <Redirect exact to="/analytics" />
            </Switch>
          </div>
        </div>
      </HashRouter>
    </ConnectedRouter>
  </Provider>
);

export default (process.env.NODE_ENV === "development"
  ? hot(module)(App)
  : App);
