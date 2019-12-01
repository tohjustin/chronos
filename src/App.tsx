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
import GlobalStatusOverlay from "./containers/GlobalStatusOverlay";
import { TimeRange } from "./models/time";
import {
  Dispatch,
  RootState,
  actions,
  history,
  selectors,
  store
} from "./store";
import {
  SEARCH_PARAM_START_DATE,
  SEARCH_PARAM_END_DATE
} from "./store/router/constants";
import theme from "./theme";
import { pickSearchParams } from "./utils/urlUtils";
import AnalyticsView from "./views/analytics";
import HistoryView from "./views/history";
import SettingsView from "./views/settings";

interface AppShellProps {
  loadRecords: () => void;
  isExportingDatabaseRecords: boolean;
  isImportingDatabaseRecords: boolean;
  searchParams: string;
  selectedDomain: string | null;
  selectedTimeRange: TimeRange;
}

const AppShell = ({
  loadRecords,
  isExportingDatabaseRecords,
  isImportingDatabaseRecords,
  searchParams,
  selectedDomain,
  selectedTimeRange
}: AppShellProps) => {
  const search = useMemo(() => {
    return pickSearchParams(searchParams, [
      SEARCH_PARAM_START_DATE,
      SEARCH_PARAM_END_DATE
    ]).toString();
  }, [searchParams]);
  useEffect(() => {
    loadRecords();
  }, [loadRecords, selectedDomain, selectedTimeRange]);

  return (
    <ThemeProvider value={theme}>
      <div className="app__container">
        <Navbar
          className="app__navbar"
          isDisabled={isExportingDatabaseRecords || isImportingDatabaseRecords}
          primaryItems={[
            {
              icon: <BarChart2 />,
              text: "Analytics",
              to: { pathname: "/analytics", search }
            },
            {
              icon: <Clock />,
              text: "History",
              to: { pathname: "/history", search }
            }
          ]}
          secondaryItems={[
            {
              icon: <Settings />,
              text: "Settings",
              to: {
                pathname: "/settings"
              }
            }
          ]}
        />
        <div className="app__view">
          <GlobalStatusOverlay />
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
  isExportingDatabaseRecords: selectors.getIsExportingDatabaseRecords(state),
  isImportingDatabaseRecords: selectors.getIsImportingDatabaseRecords(state),
  searchParams: selectors.getSearchParams(state),
  selectedDomain: selectors.getSearchParamsSelectedDomain(state),
  selectedTimeRange: selectors.getSearchParamsSelectedTimeRange(state)
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
