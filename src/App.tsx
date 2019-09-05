import { ConnectedRouter } from "connected-react-router";
import React, { useEffect } from "react";
import { BarChart2, Clock, Settings, Tag } from "react-feather";
import { hot } from "react-hot-loader";
import { connect, Provider } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import Navbar from "./components/Navbar";
import { Dispatch, actions, history, store } from "./store";
import AnalyticsView from "./views/analytics";
import HistoryView from "./views/history";
import SettingsView from "./views/settings";

interface AppShellProps {
  loadRecords: () => void;
}

const AppShell = ({ loadRecords }: AppShellProps) => {
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <div className="app__container">
      <Navbar
        className="app__navbar"
        primaryItems={[
          {
            featherIcon: BarChart2,
            text: "Analytics",
            to: "/analytics"
          },
          {
            featherIcon: Clock,
            text: "History",
            to: "/history"
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
      <div className="app__view">
        <Switch>
          <Route path="/analytics" component={AnalyticsView} />
          <Route path="/history" component={HistoryView} />
          <Route path="/settings" component={SettingsView} />
          <Redirect exact to="/analytics" />
        </Switch>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadRecords: actions.loadRecords }, dispatch);

const ConnectedAppShell = connect(
  null,
  mapDispatchToProps
)(AppShell);

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <HashRouter basename="">
        <ConnectedAppShell />
      </HashRouter>
    </ConnectedRouter>
  </Provider>
);

export default process.env.NODE_ENV === "development" ? hot(module)(App) : App;
