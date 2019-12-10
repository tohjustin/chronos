import { Avatar, Position, SelectMenu } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, IconButton } from "../../components/Button";
import { Domain } from "../../models/activity";
import { Dispatch, RootState, actions, selectors } from "../../store";
import { BUTTON_MARGIN, ICON_SIZE_MD } from "../../styles/constants";

import "./styles.scss";

interface DomainPickerProps {
  allDomains: Record<string, Domain>;
  isLoadingRecords: boolean;
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
}

const MENU_HEIGHT = 400;
const MENU_WIDTH = 320;

const DomainPicker = ({
  allDomains,
  isLoadingRecords,
  selectedDomain,
  setSelectedDomain
}: DomainPickerProps) => {
  const favIconUrl =
    selectedDomain && allDomains[selectedDomain]
      ? allDomains[selectedDomain].favIconUrl
      : undefined;

  return (
    <span className="domain-picker">
      {selectedDomain && (
        <span className="domain-picker__label">
          {favIconUrl && (
            <Avatar
              className="domain-picker__icon"
              key={selectedDomain}
              hashValue={selectedDomain}
              name={selectedDomain}
              src={favIconUrl}
              size={ICON_SIZE_MD}
            />
          )}
          <span className="domain-picker__text">{selectedDomain}</span>
        </span>
      )}
      <SelectMenu
        height={MENU_HEIGHT}
        width={MENU_WIDTH}
        closeOnSelect={true}
        hasTitle={false}
        isMultiSelect={false}
        onDeselect={() => setSelectedDomain(null)}
        onSelect={item => setSelectedDomain(item.value as string)}
        options={Object.keys(allDomains)
          .sort()
          .map(domain => ({ label: domain, value: domain }))}
        position={Position.BOTTOM_RIGHT}
        selected={selectedDomain === null ? undefined : [selectedDomain]}
        statelessProps={{
          className: "domain-picker__popover"
        }}
      >
        {selectedDomain ? (
          <IconButton disabled={isLoadingRecords} icon="caret-down" />
        ) : (
          <Button
            disabled={isLoadingRecords}
            iconAfter="caret-down"
            marginRight={BUTTON_MARGIN}
          >
            Select Domain
          </Button>
        )}
      </SelectMenu>
    </span>
  );
};

const mapStateToProps = (state: RootState) => ({
  allDomains: selectors.getAllDomains(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state),
  selectedDomain: selectors.getSearchParamsSelectedDomain(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setSelectedDomain: actions.setSelectedDomain
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DomainPicker);
