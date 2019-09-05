import { Avatar, Spinner, Table } from "evergreen-ui";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useDebounce } from "use-debounce";

import { useClientDimensions } from "../../hooks";
import { ActivityRecord } from "../../models/activity";
import { RootState, selectors } from "../../store";
import { SPINNER_SIZE } from "../../styles/constants";
import {
  formatTableDurationLabel,
  formatTableDateTimeLabel
} from "../../utils/stringUtils";

import "./styles.scss";

interface HistoryTableProps {
  data: ActivityRecord[];
}

const HEADER_HEIGHT = 32;
const INITIAL_ROW_COUNT = 150;
const ROWS_TO_LOAD_PER_BATCH = 300;
const ROW_HEIGHT = 48;
const THEME_BASE_SIZE = 16;

const renderRow = ({ activity }: { activity: ActivityRecord }) => {
  const activityDateTime = formatTableDateTimeLabel(
    new Date(activity.startTime)
  );
  const activityDuration = formatTableDurationLabel(
    activity.endTime - activity.startTime
  );
  return (
    <Table.Row
      key={activity.id}
      data-activity-id={activity.id}
      height={ROW_HEIGHT}
    >
      <Table.Cell display="flex" alignItems="center" flexGrow={80}>
        <Avatar
          className="history-table__label-icon"
          hashValue={activity.origin}
          name={activity.origin}
          src={activity.favIconUrl}
          size={THEME_BASE_SIZE * 1.25}
        />
        <div className="history-table__label">
          <strong>{`${activity.title}`}</strong>
          <span>
            <a href={activity.url}>{activity.url}</a>
          </span>
        </div>
      </Table.Cell>
      <Table.Cell display="flex" alignItems="center" flexGrow={20}>
        <div className="history-table__label history-table__label--duration">
          <strong>{activityDateTime}</strong>
          <span>{activityDuration}</span>
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

const HistoryTable = ({ data }: HistoryTableProps) => {
  const [containerRef, { height: containerHeight }] = useClientDimensions();
  const [rowCount, setRowCount] = useState(INITIAL_ROW_COUNT);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const handleFilterChange = useCallback(setSearchQuery, []);
  const handleOnScroll = useCallback(
    (scrollTop: number) => {
      // Poor attempt of implementing lazy loading 😰
      // This is neccessary b/c evergreen-ui's uses `react-tiny-virtual-list`
      // internally & it doesn't quite scale well beyond 1k++ entries...
      const visibleRowCount = containerHeight / ROW_HEIGHT;
      const viewedRowCount = scrollTop / ROW_HEIGHT + visibleRowCount;
      if (viewedRowCount + visibleRowCount >= rowCount) {
        setRowCount(rowCount + ROWS_TO_LOAD_PER_BATCH);
      }
    },
    [containerHeight, rowCount]
  );
  const activities = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    const matchedResults =
      query.length < 1
        ? data
        : data.filter(
            activity =>
              (activity.url && activity.url.toLowerCase().includes(query)) ||
              (activity.title && activity.title.toLowerCase().includes(query))
          );

    return matchedResults
      .sort((a, b) => (a.startTime > b.startTime ? -1 : 1))
      .slice(0, rowCount);
  }, [data, debouncedSearchQuery, rowCount]);
  const isDebounceActive = debouncedSearchQuery !== searchQuery;

  let tableContent;
  const tableBodyHeight = containerHeight - HEADER_HEIGHT;
  switch (true) {
    case isDebounceActive:
      tableContent = (
        <div
          className="history-table__body-placeholder"
          style={{ height: tableBodyHeight }}
        >
          <Spinner size={SPINNER_SIZE} />
        </div>
      );
      break;
    case activities.length === 0 && searchQuery !== "":
      tableContent = (
        <div
          className="history-table__body-placeholder"
          style={{ height: tableBodyHeight }}
        >
          No matches found
        </div>
      );
      break;
    default:
      tableContent = (
        <Table.VirtualBody
          estimatedItemSize={ROW_HEIGHT}
          height={tableBodyHeight}
          onScroll={handleOnScroll}
          overscanCount={Math.round(containerHeight / ROW_HEIGHT) * 2}
          useAverageAutoHeightEstimation={false}
        >
          {activities.map(activity => renderRow({ activity }))}
        </Table.VirtualBody>
      );
  }

  return (
    <div ref={containerRef} className="history-table__container">
      <Table>
        <Table.Head height={HEADER_HEIGHT} className="history-table__header">
          <Table.SearchHeaderCell
            flexGrow={100}
            onChange={handleFilterChange}
            value={searchQuery}
          />
        </Table.Head>
        {tableContent}
      </Table>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  data: selectors.getAllRecords(state)
});

export default connect(mapStateToProps)(HistoryTable);
