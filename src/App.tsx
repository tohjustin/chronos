import { ConnectedRouter } from "connected-react-router";
import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";

import store, { history } from "./store";
import AnalyticsView from "./views/analytics";
import SettingsView from "./views/settings";

class App extends Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <HashRouter basename="">
            <div className="app-container">
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
  }
}

export default (process.env.NODE_ENV === "development"
  ? hot(module)(App)
  : App);
