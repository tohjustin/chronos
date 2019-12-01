import { Overlay, Spinner } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";

import { RootState, selectors } from "../../store";
import { SPINNER_SIZE } from "../../styles/constants";

import BeforeUnload from "./BeforeUnload";

import "./styles.scss";

interface GlobalStatusOverlayProps {
  isExportingDatabaseRecords: boolean;
  isImportingDatabaseRecords: boolean;
}

const GlobalStatusOverlay = ({
  isExportingDatabaseRecords,
  isImportingDatabaseRecords
}: GlobalStatusOverlayProps) => {
  let statusText;
  switch (true) {
    case isExportingDatabaseRecords:
      statusText = "Exporting data, this might a while...";
      break;
    case isImportingDatabaseRecords:
      statusText = "Importing data, this might a while...";
      break;
    default:
      return null;
  }

  return (
    <>
      <BeforeUnload />
      <Overlay
        isShown={true}
        shouldCloseOnClick={false}
        shouldCloseOnEscapePress={false}
        containerProps={{ className: "global-status-overlay" }}
        preventBodyScrolling={true}
      >
        <div className="global-status-overlay__dialog" role="dialog">
          <Spinner size={SPINNER_SIZE} />
          <p>{statusText}</p>
        </div>
      </Overlay>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isExportingDatabaseRecords: selectors.getIsExportingDatabaseRecords(state),
  isImportingDatabaseRecords: selectors.getIsImportingDatabaseRecords(state)
});

export default connect(mapStateToProps)(GlobalStatusOverlay);
