import { ConnectedRouter } from "connected-react-router";
import { ThemeProvider } from "evergreen-ui";
import React, { useEffect, useMemo } from "react";
import { BarChart2, Clock, Settings } from "react-feather";
import { hot } from "react-hot-loader";
import { connect, Provider } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import Navbar from "./components/Navbar";
import {
  Dispatch,
  RootState,
  actions,
  history,
  selectors,
  store
} from "./store";
import theme from "./theme";
import AnalyticsView from "./views/analytics";
import HistoryView from "./views/history";
import SettingsView from "./views/settings";
import {
  SEARCH_PARAM_START_DATE,
  SEARCH_PARAM_END_DATE
} from "./store/router/constants";
import { pickSearchParams } from "./utils/urlUtils";

interface AppShellProps {
  loadRecords: () => void;
  searchParams: string;
}

const AppShell = ({ loadRecords, searchParams }: AppShellProps) => {
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);
  const search = useMemo(() => {
    return pickSearchParams(searchParams, [
      SEARCH_PARAM_START_DATE,
      SEARCH_PARAM_END_DATE
    ]).toString();
  }, [searchParams]);

  return (
    <ThemeProvider value={theme}>
      <div className="app__container">
        <Navbar
          className="app__navbar"
          primaryItems={[
            {
              featherIcon: BarChart2,
              text: "Analytics",
              to: { pathname: "/analytics", search }
            },
            {
              featherIcon: Clock,
              text: "History",
              to: { pathname: "/history", search }
            }
          ]}
          secondaryItems={[
            {
              featherIcon: Settings,
              text: "Settings",
              to: {
                pathname: "/settings"
              }
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
    </ThemeProvider>
  );
};

const mapStateToProps = (state: RootState) => ({
  searchParams: selectors.getSearchParams(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadRecords: actions.loadRecords }, dispatch);

const ConnectedAppShell = connect(
  mapStateToProps,
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
