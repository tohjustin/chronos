import { Table } from "evergreen-ui";
import React from "react";

import { BASE_SIZE } from "../../styles/constants";

import { TableRowProps } from "./types";

export const DEFAULT_TABLE_ROW_HEIGHT = BASE_SIZE * 3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultTableRow = (props: TableRowProps<any>): React.ReactNode => {
  return (
    <Table.Row className="table__row" height={DEFAULT_TABLE_ROW_HEIGHT}>
      <span>{JSON.stringify(props.datum)}</span>
    </Table.Row>
  );
};

export default DefaultTableRow;
