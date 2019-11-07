import { IntentTypes, defaultTheme } from "evergreen-ui";
import classnames from "classnames";
import _ from "lodash";

import {
  COLOR_BLACK,
  COLOR_DANGER,
  COLOR_GREY_DARKER,
  COLOR_PRIMARY,
  COLOR_SUCCESS,
  COLOR_WARNING
} from "./styles/constants";

const originalGetHeadingStyle = defaultTheme.getHeadingStyle;
const originalGetMenuItemClassName = defaultTheme.getMenuItemClassName;
const originalGetRowClassName = defaultTheme.getRowClassName;
const originalGetTableCellClassName = defaultTheme.getTableCellClassName;

const theme = _.merge(defaultTheme, {
  colors: {
    text: {
      muted: COLOR_GREY_DARKER,
      default: COLOR_BLACK,
      dark: COLOR_BLACK,
      selected: COLOR_PRIMARY,

      // Intent
      danger: COLOR_DANGER,
      info: COLOR_PRIMARY,
      success: COLOR_SUCCESS,
      warning: COLOR_WARNING
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
