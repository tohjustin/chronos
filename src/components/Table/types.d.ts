import React from "react";

export interface TableSortOption<U, V> {
  buttonLabel: string;
  optionLabel: string;
  optionSublabel?: string;
  value: V;
  sortFn: (data: U[]) => U[];
}

export interface TableSortButtonProps<U, V> {
  onSelect: (value: V) => void;
  sortOptions: TableSortOption<U, V>[];
  sortOrder: TableSortOption | null;
}

export interface TableRowProps<U> {
  datum: U;
  rowIndex: number;
}

export interface TableProps<U, V = null> {
  data: U[];
  defaultSortOrder: V | null;
  filterFn?: (data: U[], filter: string) => U[];
  filterPlaceholder?: string;
  formatEntries?: (count: number) => string;
  rowHeight?: number;
  rowRenderer?: (props: TableRowProps<U>) => React.ReactNode;
  sortOptions?: TableSortOption<U, V>[];
}
