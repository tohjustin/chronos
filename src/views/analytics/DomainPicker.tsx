import { IconButton, SelectMenu } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Button from "../../components/Button";
import { Dispatch, RootState, actions, selectors } from "../../store";
import { BUTTON_MARGIN } from "../../styles/constants";

interface DomainPickerProps {
  allDomains: {
    [domain: string]: { favIconUrl?: string };
  };
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
}

const DomainPicker = (props: DomainPickerProps) => {
  const favIconUrl =
    props.selectedDomain && props.allDomains[props.selectedDomain]
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
        options={Object.keys(props.allDomains)
          .sort()
          .map(domain => ({
            label: domain,
            value: domain
          }))}
        selected={
          props.selectedDomain === null ? undefined : [props.selectedDomain]
        }
        hasTitle={false}
        onSelect={item => props.setSelectedDomain(item.value)}
        onDeselect={() => props.setSelectedDomain(null)}
        height={400}
        width={320}
      >
        {props.selectedDomain ? (
          <IconButton icon="caret-down" />
        ) : (
          <Button iconAfter="caret-down" marginRight={BUTTON_MARGIN}>
            Select Domain
          </Button>
        )}
      </SelectMenu>
    </span>
  );
};

const mapStateToProps = (state: RootState) => ({
  allDomains: selectors.getAllDomains(state),
  selectedDomain: selectors.getSelectedDomain(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setSelectedDomain: actions.setSelectedDomain
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainPicker);
