import classNames from "classnames";
import React from "react";

import {
  IS_CHROME,
  IS_EDGE,
  IS_FIREFOX,
  IS_OPERA,
  IS_SAFARI
} from "../../utils/browserUtils";

import "./styles.scss";

interface DemoBannerProps {
  className?: string;
}

const BUILD_TARGET = process.env.REACT_APP_BUILD_TARGET;
const PROJECT_HOMEPAGE = process.env.REACT_APP_PROJECT_HOMEPAGE;
const FIREFOX_ADDONS_URL = process.env.REACT_APP_FIREFOX_ADDONS_URL;
const CHROME_WEBSTORE_URL = process.env.REACT_APP_CHROME_WEBSTORE_URL;

const DemoBanner = ({ className }: DemoBannerProps) => {
  if (BUILD_TARGET !== "demo") {
    return null;
  }

  const content =
    PROJECT_HOMEPAGE !== undefined ? (
      <>
        You are currently viewing a demo of&nbsp;
        <a href={PROJECT_HOMEPAGE}>Chronos</a>.
      </>
    ) : (
      <>You are currently viewing a demo of Chronos.</>
    );

  let description;
  switch (true) {
    case IS_SAFARI:
      description = <>&nbsp;This extension is not available on Safari.</>;
      break;
    // TODO: Update this when extension is available on Edge Chromium
    case IS_EDGE:
      description = (
        <>&nbsp;This extension will be available soon on Edge Chromium.</>
      );
      break;
    // TODO: Update this when extension is available on Opera Stable
    case IS_OPERA:
      description = <>&nbsp;This extension will be available soon on Opera.</>;
      break;
    case IS_FIREFOX && FIREFOX_ADDONS_URL !== undefined:
      description = (
        <>
          &nbsp;Download the add-on from&nbsp;
          <a href={FIREFOX_ADDONS_URL}>Firefox Add-ons</a>.
        </>
      );
      break;
    case IS_CHROME && CHROME_WEBSTORE_URL !== undefined:
      description = (
        <>
          &nbsp;Download the extension from&nbsp;
          <a href={CHROME_WEBSTORE_URL}>Chrome Web Store</a>.
        </>
      );
      break;
  }

  return (
    <div className={classNames("banner", className)}>
      <span>
        {content}
        {description}
      </span>
    </div>
  );
};

export default DemoBanner;
