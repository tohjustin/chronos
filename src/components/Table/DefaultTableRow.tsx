import classNames from "classnames";
import { Table } from "evergreen-ui";
import React from "react";

import { BASE_SIZE } from "../../styles/constants";

import { DatumWithId, TableRowBaseProps } from "./types";

export const DEFAULT_TABLE_ROW_HEIGHT = BASE_SIZE * 3;

function DefaultTableRow<T extends DatumWithId>({
  datum,
  isSelectable,
  onRowClick,
  selectedIds
}: TableRowBaseProps<T>): JSX.Element {
  return (
    <Table.Row
      className={classNames("table__row", {
        "table__row--selectable": isSelectable,
        "table__row--selected":
          selectedIds !== undefined &&
          datum.id !== undefined &&
          selectedIds.includes(datum.id)
      })}
      height={DEFAULT_TABLE_ROW_HEIGHT}
      onClick={isSelectable && onRowClick ? () => onRowClick(datum) : undefined}
    >
      <span>{JSON.stringify(datum)}</span>
    </Table.Row>
  );
}

export default DefaultTableRow;
