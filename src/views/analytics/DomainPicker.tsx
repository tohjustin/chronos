import { Button, IconButton, SelectMenu } from "evergreen-ui";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import actions from "../../store/root-action";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";
import { BUTTON_MARGIN, BUTTON_SIZE } from "../../styles/constants";

interface DomainPickerProps {
  allDomains: {
    [domain: string]: { favIconUrl?: string };
  };
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
}

const DomainPicker = (props: DomainPickerProps) => {
  const favIconUrl = props.selectedDomain
    ? props.allDomains[props.selectedDomain].favIconUrl
    : undefined;

  return (
    <span className="analytics-view__domain-picker">
      {props.selectedDomain && (
        <span className="label">
          {favIconUrl && (
            <img
              key={props.selectedDomain}
              alt="domain-icon"
              className="icon"
              src={favIconUrl}
            />
          )}
          <span>{props.selectedDomain}</span>
        </span>
      )}
      <SelectMenu
        isMultiSelect
        className="select-menu"
        options={Object.keys(props.allDomains)
          .sort()
          .map(domain => ({
            label: domain,
            value: domain
          }))}
        selected={
          props.selectedDomain === null ? undefined : [props.selectedDomain]
        }
        title="Select domain"
        onSelect={item => props.setSelectedDomain(item.value)}
        onDeselect={() => props.setSelectedDomain(null)}
        height={400}
        width={320}
      >
        {props.selectedDomain ? (
          <IconButton height={BUTTON_SIZE} icon="caret-down" />
        ) : (
          <Button
            height={BUTTON_SIZE}
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
  allDomains: selector.getAllDomains(state),
  selectedDomain: selector.getSelectedDomain(state)
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setSelectedDomain: actions.activity.setSelectedDomain
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainPicker);
