export interface DatumWithId {
  id?: number;
}

export interface TableSortOption<U, V> {
  buttonLabel: string;
  optionLabel: string;
  optionSublabel?: string;
  value: V;
  sortFn: (data: U[]) => U[];
}

export interface TableSortButtonProps<U, V> {
  disabled: boolean;
  onSelect: (value: V) => void;
  sortOptions: TableSortOption<U, V>[];
  sortOrder: TableSortOption | null;
}

export interface TableRowProps<U> {
  datum: U;
  isSelectable?: boolean;
  selectedIds?: number[];
  onRowClick?: (datum: U) => void;
}

export interface TableProps<U extends DatumWithId, V = null> {
  data: U[];
  autoFocus?: boolean;
  defaultSortOrder?: V | null;
  disabled?: boolean;
  filterFn?: (data: U[], filter: string) => U[];
  filterPlaceholder?: string;
  formatEntries?: (count: number) => string;
  isLoading?: boolean;
  onRowClick?: (datum: U) => void;
  rowHeight?: number;
  rowRenderer?: (props: TableRowProps<U>) => JSX.Element;
  selectedIds?: number[];
  sortOptions?: TableSortOption<U, V>[];
}
