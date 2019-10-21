import {
  Avatar,
  Heading,
  Menu,
  Pane,
  Popover,
  Spinner,
  Table
} from "evergreen-ui";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useDebounce } from "use-debounce";

import Button from "../../components/Button";
import ExternalLink from "../../components/ExternalLink";
import { useClientDimensions } from "../../hooks";
import { ActivityRecord } from "../../models/activity";
import { RootState, selectors } from "../../store";
import { BASE_SIZE, SPINNER_SIZE } from "../../styles/constants";
import {
  formatTableDurationLabel,
  formatTableDateTimeLabel
} from "../../utils/stringUtils";

interface HistoryTableProps {
  data: ActivityRecord[];
}

enum SortOrder {
  DurationAscending = "DURATION_ASCENDING",
  DurationDescending = "DURATION_DESCENDING",
  TimeAscending = "TIME_ASCENDING",
  TimeDescending = "TIME_DESCENDING"
}

const AVATAR_SIZE = BASE_SIZE * 2.5;
const DEFAULT_SORT_ORDER = "TIME_DESCENDING" as SortOrder;
const FOOTER_HEIGHT = BASE_SIZE * 4;
const HEADER_HEIGHT = BASE_SIZE * 4;
const INITIAL_ROW_COUNT = 150;
const MENU_OPTIONS = [
  {
    label: "Sorted by Duration",
    secondaryLabel: "Ascending",
    value: "DURATION_ASCENDING" as SortOrder
  },
  {
    label: "Sorted by Duration",
    secondaryLabel: "Descending",
    value: "DURATION_DESCENDING" as SortOrder
  },
  {
    label: "Sorted by Time",
    secondaryLabel: "Ascending",
    value: "TIME_ASCENDING" as SortOrder
  },
  {
    label: "Sorted by Time",
    secondaryLabel: "Descending",
    value: "TIME_DESCENDING" as SortOrder
  }
];
const ROW_HEIGHT = BASE_SIZE * 6;
const ROWS_TO_LOAD_PER_BATCH = 300;

function formatRecordString(count: number) {
  return `${count.toLocaleString("en-US")} ${count > 1 ? "records" : "record"}`;
}

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
          size={AVATAR_SIZE}
        />
        <div className="history-table__label">
          <strong>{`${activity.title}`}</strong>
          <ExternalLink url={activity.url} />
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
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
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
    const result =
      query.length < 1
        ? data
        : data.filter(
            record =>
              record.url.toLowerCase().includes(query) ||
              record.title.toLowerCase().includes(query)
          );
    switch (sortOrder) {
      case "DURATION_ASCENDING":
        return result
          .slice()
          .sort((a, b) =>
            a.endTime - a.startTime > b.endTime - b.startTime ? 1 : -1
          );
      case "DURATION_DESCENDING":
        return result
          .slice()
          .sort((a, b) =>
            a.endTime - a.startTime > b.endTime - b.startTime ? -1 : 1
          );
      case "TIME_ASCENDING":
        return result
          .slice()
          .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
      case "TIME_DESCENDING":
        return result
          .slice()
          .sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
      default:
        console.warn("HistoryTable: Unknown `state.sortOrder`", sortOrder);
        return result;
    }
  }, [data, debouncedSearchQuery, sortOrder]);
  const visibleActivities = useMemo(() => {
    return activities.slice(0, rowCount);
  }, [activities, rowCount]);

  let tableContent;
  const isDebounceActive = debouncedSearchQuery !== searchQuery;
  const tableBodyHeight = containerHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
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
    case visibleActivities.length === 0:
      tableContent = (
        <div
          className="history-table__body-placeholder"
          style={{ height: tableBodyHeight }}
        >
          {searchQuery === "" ? "No activity" : "No matches found"}
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
          {visibleActivities.map(activity => renderRow({ activity }))}
        </Table.VirtualBody>
      );
  }

  let buttonText;
  switch (sortOrder) {
    case "DURATION_ASCENDING":
      buttonText = "Sorted by Duration (Ascending)";
      break;
    case "DURATION_DESCENDING":
      buttonText = "Sorted by Duration (Descending)";
      break;
    case "TIME_ASCENDING":
      buttonText = "Sorted by Time (Ascending)";
      break;
    case "TIME_DESCENDING":
      buttonText = "Sorted by Time (Descending)";
      break;
  }

  let footerText;
  const records = formatRecordString(data.length);
  switch (true) {
    case isDebounceActive:
      footerText = `Sifting through ${records}...`;
      break;
    case searchQuery !== "": {
      const matchedRecords = formatRecordString(activities.length);
      footerText = `Found ${matchedRecords} out of ${records}`;
      break;
    }
    default:
      footerText = `Found ${records}`;
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
          <Popover
            position="bottom-right"
            content={
              <Menu>
                <Pane>
                  <Heading size={100}>Sort Order</Heading>
                  <Pane>
                    {MENU_OPTIONS.map(option => (
                      <Menu.Option
                        key={option.value}
                        isSelected={option.value === sortOrder}
                        onSelect={() => setSortOrder(option.value)}
                        secondaryText={option.secondaryLabel}
                      >
                        {option.label}
                      </Menu.Option>
                    ))}
                  </Pane>
                </Pane>
              </Menu>
            }
            statelessProps={{ className: "history-view__sort-popover" }}
          >
            <Button
              appearance="minimal"
              iconBefore="sort"
              isActive={true}
              className="history-table__sort-button"
            >
              {buttonText}
            </Button>
          </Popover>
        </Table.Head>
        {tableContent}
        <Table.Cell height={FOOTER_HEIGHT} className="history-table__footer">
          <div>{footerText}</div>
        </Table.Cell>
      </Table>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  data: selectors.getRecords(state)
});

export default connect(mapStateToProps)(HistoryTable);
