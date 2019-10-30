import { Table } from "evergreen-ui";
import React from "react";

import { BASE_SIZE } from "../../styles/constants";

import { TableRowProps } from "./types";

export const DEFAULT_TABLE_ROW_HEIGHT = BASE_SIZE * 3;

function DefaultTableRow<T>({ datum }: TableRowProps<T>): React.ReactNode {
  return (
    <Table.Row className="table__row" height={DEFAULT_TABLE_ROW_HEIGHT}>
      <span>{JSON.stringify(datum)}</span>
    </Table.Row>
  );
}

export default DefaultTableRow;
