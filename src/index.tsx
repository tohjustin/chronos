import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { InitActivityLogger } from "./activity-logger";
import "./styles/app.scss";

// use `window.innerHeight` & `window.innerWidth` to determined if script
// is loading in the context of a web extension background page
function isBackgroundPage(): boolean {
  return window.innerHeight === 0 && window.innerWidth === 0;
}

if (isBackgroundPage()) {
  console.log(
    "[index.tsx]",
    "Script is loaded on a background page, begin initialization..."
  );
  InitActivityLogger();
} else {
  console.log(
    "[index.tsx]",
    "Script is not loaded on a background page, aborting initialization..."
  );
  ReactDOM.render(<App />, document.getElementById("root"));
}
