import classNames from "classnames";
import { Spinner, Table as EvergreenTable } from "evergreen-ui";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { useClientDimensions } from "../../hooks";
import { BASE_SIZE, SPINNER_SIZE } from "../../styles/constants";

import defaultRowRenderer, {
  DEFAULT_TABLE_ROW_HEIGHT
} from "./DefaultTableRow";
import TableSortButton from "./TableSortButton";
import { DatumWithId, TableProps } from "./types";

import "./styles.scss";

const DEFAULT_FILTER_PLACEHOLDER = "No entries";
const FOOTER_HEIGHT = BASE_SIZE * 4;
const HEADER_HEIGHT = BASE_SIZE * 4;
const INITIAL_ROW_COUNT = 150;
const ROWS_TO_LOAD_PER_BATCH = 300;

function defaultFormatEntries(count: number) {
  return `${count.toLocaleString("en-US")} ${count > 1 ? "entries" : "entry"}`;
}

function Table<U extends DatumWithId, V = null>({
  autoFocus,
  data,
  defaultSortOrder = null,
  disabled = true,
  filterFn,
  filterPlaceholder = DEFAULT_FILTER_PLACEHOLDER,
  formatEntries = defaultFormatEntries,
  onRowClick,
  rowHeight = DEFAULT_TABLE_ROW_HEIGHT,
  rowRenderer,
  selectedIds,
  sortOptions
}: TableProps<U, V>) {
  const [containerRef, { height: containerHeight }] = useClientDimensions();
  const [rowCount, setRowCount] = useState(INITIAL_ROW_COUNT);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<V | null>(defaultSortOrder);
  const [debouncedFilter] = useDebounce(filter, 500);
  const handleFilterChange = useCallback(setFilter, []);
  const handleScroll = useCallback(
    (scrollTop: number) => {
      // Poor attempt of implementing lazy loading 😰
      // This is neccessary b/c evergreen-ui's uses `react-tiny-virtual-list`
      // internally & it doesn't quite scale well beyond 1k++ entries...
      const visibleRowCount = containerHeight / rowHeight;
      const viewedRowCount = scrollTop / rowHeight + visibleRowCount;
      if (viewedRowCount + visibleRowCount >= rowCount) {
        setRowCount(rowCount + ROWS_TO_LOAD_PER_BATCH);
      }
    },
    [containerHeight, rowCount, rowHeight, setRowCount]
  );
  const activities = useMemo(() => {
    let result = data;

    if (filterFn) {
      result = filterFn(data, debouncedFilter.trim().toLowerCase());
    }

    const sortOption = _.find(sortOptions, o => sortOrder === o.value);
    if (sortOption) {
      result = sortOption.sortFn(result);
    }

    return result;
  }, [data, debouncedFilter, filterFn, sortOptions, sortOrder]);
  const visibleActivities = useMemo(() => {
    return activities.slice(0, rowCount);
  }, [activities, rowCount]);

  let tableContent;
  const isDebounceActive = debouncedFilter !== filter;
  const tableBodyHeight = containerHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
  switch (true) {
    case isDebounceActive:
      tableContent = (
        <div
          className="table__body table__body-placeholder"
          style={{ height: tableBodyHeight }}
        >
          <Spinner size={SPINNER_SIZE} />
        </div>
      );
      break;
    case visibleActivities.length === 0:
      tableContent = (
        <div
          className="table__body table__body-placeholder"
          style={{ height: tableBodyHeight }}
        >
          {filter === "" ? filterPlaceholder : "No matches found"}
        </div>
      );
      break;
    default: {
      const tableRowRenderer = rowRenderer ? rowRenderer : defaultRowRenderer;
      const isSelectable = !disabled && selectedIds !== undefined;
      tableContent = (
        <EvergreenTable.VirtualBody
          allowAutoHeight={false}
          className="table__body"
          estimatedItemSize={rowHeight}
          height={tableBodyHeight}
          onScroll={handleScroll}
          overscanCount={Math.round(containerHeight / rowHeight) * 2}
          useAverageAutoHeightEstimation={false}
        >
          {visibleActivities.map(datum =>
            tableRowRenderer({ datum, isSelectable, onRowClick, selectedIds })
          )}
        </EvergreenTable.VirtualBody>
      );
    }
  }

  let footerText;
  const entriesWithUnit = formatEntries(data.length);
  switch (true) {
    case isDebounceActive:
      footerText = `Sifting through ${entriesWithUnit}...`;
      break;
    case filter !== "": {
      const matchedRecords = formatEntries(activities.length);
      footerText = `Found ${matchedRecords} out of ${entriesWithUnit}`;
      break;
    }
    default:
      footerText = `Found ${entriesWithUnit}`;
  }

  return (
    <div ref={containerRef} className="table__container">
      <EvergreenTable>
        <EvergreenTable.Head
          height={HEADER_HEIGHT}
          className={classNames("table__header", {
            "table__header--disabled": disabled
          })}
        >
          {filterFn && (
            <EvergreenTable.SearchHeaderCell
              autoFocus={autoFocus}
              flexGrow={100}
              onChange={disabled ? undefined : handleFilterChange}
              value={filter}
            />
          )}
          {sortOptions && sortOptions.length > 0 && (
            <TableSortButton
              disabled={disabled}
              onSelect={setSortOrder}
              sortOrder={sortOrder}
              sortOptions={sortOptions}
            />
          )}
        </EvergreenTable.Head>
        {tableContent}
        <EvergreenTable.Cell height={FOOTER_HEIGHT} className="table__footer">
          <div>{footerText}</div>
        </EvergreenTable.Cell>
      </EvergreenTable>
    </div>
  );
}

export default Table;
