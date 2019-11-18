import classNames from "classnames";
import { Avatar, Table as EvergreenTable } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";

import ExternalLink from "../../components/ExternalLink";
import Table from "../../components/Table";
import { TableRowProps, TableSortOption } from "../../components/Table/types";
import { ActivityRecord } from "../../models/activity";
import { RootState, selectors } from "../../store";
import { BASE_SIZE, ICON_SIZE_MD } from "../../styles/constants";
import {
  formatTableDurationLabel,
  formatTableDateTimeLabel
} from "../../utils/stringUtils";

interface HistoryTableProps {
  data: ActivityRecord[];
  autoFocus?: boolean;
  disabled?: boolean;
  selectedRecordIds?: number[];
  onRowClick?: (datum: ActivityRecord) => void;
}

enum HistoryTableSortOrder {
  DurationAscending = "DURATION_ASCENDING",
  DurationDescending = "DURATION_DESCENDING",
  TimeAscending = "TIME_ASCENDING",
  TimeDescending = "TIME_DESCENDING"
}

const ROW_HEIGHT = BASE_SIZE * 6;
const DEFAULT_SORT_ORDER = "TIME_DESCENDING" as HistoryTableSortOrder;
const SORT_OPTIONS: TableSortOption<ActivityRecord, HistoryTableSortOrder>[] = [
  {
    buttonLabel: "Sorted by Duration (Ascending)",
    optionLabel: "Sorted by Duration",
    optionSublabel: "Ascending",
    value: "DURATION_ASCENDING" as HistoryTableSortOrder,
    sortFn: data =>
      data
        .slice()
        .sort((a, b) =>
          a.endTime - a.startTime > b.endTime - b.startTime ? 1 : -1
        )
  },
  {
    buttonLabel: "Sorted by Duration (Descending)",
    optionLabel: "Sorted by Duration",
    optionSublabel: "Descending",
    value: "DURATION_DESCENDING" as HistoryTableSortOrder,
    sortFn: data =>
      data
        .slice()
        .sort((a, b) =>
          a.endTime - a.startTime > b.endTime - b.startTime ? -1 : 1
        )
  },
  {
    buttonLabel: "Sorted by Time (Ascending)",
    optionLabel: "Sorted by Time",
    optionSublabel: "Ascending",
    value: "TIME_ASCENDING" as HistoryTableSortOrder,
    sortFn: data =>
      data.slice().sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
  },
  {
    buttonLabel: "Sorted by Time (Descending)",
    optionLabel: "Sorted by Time",
    optionSublabel: "Descending",
    value: "TIME_DESCENDING" as HistoryTableSortOrder,
    sortFn: data =>
      data.slice().sort((a, b) => (a.startTime > b.startTime ? -1 : 1))
  }
];

function filterActivityRecords(data: ActivityRecord[], filter: string) {
  return data.filter(
    record =>
      record.url.toLowerCase().includes(filter) ||
      record.title.toLowerCase().includes(filter)
  );
}

function formatRecordString(count: number) {
  return `${count.toLocaleString("en-US")} ${count > 1 ? "records" : "record"}`;
}

const HistoryTableRow = ({
  datum,
  isSelectable,
  onRowClick,
  selectedIds
}: TableRowProps<ActivityRecord>) => {
  const activityDateTime = formatTableDateTimeLabel(new Date(datum.startTime));
  const activityDuration = formatTableDurationLabel(
    datum.endTime - datum.startTime
  );
  return (
    <EvergreenTable.Row
      className={classNames("history-table__row", {
        "history-table__row--selectable": isSelectable,
        "history-table__row--selected":
          selectedIds !== undefined &&
          datum.id !== undefined &&
          selectedIds.includes(datum.id)
      })}
      data-activity-id={datum.id}
      height={ROW_HEIGHT}
      key={datum.id}
      onClick={isSelectable && onRowClick ? () => onRowClick(datum) : undefined}
    >
      <EvergreenTable.Cell display="flex" alignItems="center" flexGrow={80}>
        <Avatar
          className="history-table__row-icon"
          hashValue={datum.origin}
          name={datum.origin}
          src={datum.favIconUrl}
          size={ICON_SIZE_MD}
        />
        <div className="history-table__row-label">
          <strong>{`${datum.title}`}</strong>
          <ExternalLink url={datum.url} />
        </div>
      </EvergreenTable.Cell>
      <EvergreenTable.Cell display="flex" alignItems="center" flexGrow={20}>
        <div className="history-table__row-sublabel">
          <strong>{activityDateTime}</strong>
          <span>{activityDuration}</span>
        </div>
      </EvergreenTable.Cell>
    </EvergreenTable.Row>
  );
};

const HistoryTable = ({
  autoFocus,
  data,
  disabled,
  onRowClick,
  selectedRecordIds
}: HistoryTableProps) => {
  return (
    <Table
      autoFocus={autoFocus}
      data={data}
      defaultSortOrder={DEFAULT_SORT_ORDER}
      disabled={disabled}
      filterFn={filterActivityRecords}
      filterPlaceholder="No activity"
      formatEntries={formatRecordString}
      rowHeight={ROW_HEIGHT}
      rowRenderer={HistoryTableRow}
      onRowClick={onRowClick}
      selectedIds={selectedRecordIds}
      sortOptions={SORT_OPTIONS}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  data: selectors.getRecords(state)
});

export default connect(mapStateToProps)(HistoryTable);
