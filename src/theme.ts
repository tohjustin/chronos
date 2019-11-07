import { IntentTypes, defaultTheme } from "evergreen-ui";
import classnames from "classnames";
import _ from "lodash";

const originalGetHeadingStyle = defaultTheme.getHeadingStyle;
const originalGetMenuItemClassName = defaultTheme.getMenuItemClassName;
const originalGetRowClassName = defaultTheme.getRowClassName;
const originalGetTableCellClassName = defaultTheme.getTableCellClassName;

const theme = _.merge(defaultTheme, {
  colors: {
    text: {
      muted: "#62778c",
      default: "#244360",
      dark: "#244360",
      selected: "#379af7",

      // Intent
      success: "#00783e",
      info: "#379af7",
      danger: "#bf0e08",
      warning: "#95591e"
    }
  },
  getHeadingStyle: (size: number) => {
    return {
      ...originalGetHeadingStyle(size),
      fontFamily: "inherit",
      fontWeight: 600
    };
  },
  getIconColor: () => {
    return "currentColor";
  },
  getMenuItemClassName: (appearance: "default", intent: IntentTypes) => {
    return classnames(
      originalGetMenuItemClassName(appearance, intent),
      "evergreen__menu-item"
    );
  },
  getRowClassName: (appearance: "default", intent: IntentTypes) => {
    return classnames(
      originalGetRowClassName(appearance, intent),
      "evergreen__row"
    );
  },
  getTableCellClassName: (appearance: "default") => {
    return classnames(
      originalGetTableCellClassName(appearance),
      "evergreen__table-cell"
    );
  },
  typography: {
    fontFamilies: {
      display: "inherit",
      ui: "inherit",
      mono: "inherit"
    }
  }
});

export default theme;
