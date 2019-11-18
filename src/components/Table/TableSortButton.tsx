import { Heading, Menu, Pane, Popover } from "evergreen-ui";
import _ from "lodash";
import React from "react";

import { Button } from "../Button";

import { TableSortButtonProps } from "./types";

const DEFAULT_BUTTON_TEXT = "Sort";
const DEFAULT_POPOVER_HEADER = "Sort Order";

function TableSortButton<U, V>({
  disabled,
  onSelect,
  sortOptions,
  sortOrder
}: TableSortButtonProps<U, V>) {
  let buttonText = DEFAULT_BUTTON_TEXT;
  const sortOption = _.find(sortOptions, option => sortOrder === option.value);
  if (sortOption) {
    buttonText = sortOption.buttonLabel;
  }

  return (
    <Popover
      isShown={disabled ? false : undefined}
      position="bottom-right"
      content={({ close }) => {
        return (
          <Menu>
            <Pane>
              <Heading size={100}>{DEFAULT_POPOVER_HEADER}</Heading>
              <Pane>
                {_.map(sortOptions, option => (
                  <Menu.Option
                    key={option.value}
                    isSelected={option.value === sortOrder}
                    onSelect={() => {
                      close();
                      onSelect(option.value);
                    }}
                    secondaryText={option.optionSublabel}
                  >
                    {option.optionLabel}
                  </Menu.Option>
                ))}
              </Pane>
            </Pane>
          </Menu>
        );
      }}
      statelessProps={{ className: "table__sort-button--popover" }}
    >
      <Button
        appearance="minimal"
        disabled={disabled}
        iconBefore="sort"
        isActive={true}
        className="table__sort-button"
      >
        {buttonText}
      </Button>
    </Popover>
  );
}

export default TableSortButton;
