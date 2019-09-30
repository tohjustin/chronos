import { defaultTheme } from "evergreen-ui";
import _ from "lodash";

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
  typography: {
    fontFamilies: {
      display: "inherit",
      ui: "inherit",
      mono: "inherit"
    }
  }
});

export default theme;
