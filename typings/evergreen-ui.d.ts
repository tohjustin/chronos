declare module "evergreen-ui" {
  import * as React from "react";

  export interface AvatarProps {
    forceShowInitials?: () => boolean;
    getInitials?: () => string;
    className?: string;
    color?: string;
    hashValue?: string;
    isSolid?: boolean;
    name?: string;
    size?: number;
    sizeLimitOneCharacter?: number;
    src?: string;
  }
  export class Avatar extends React.PureComponent<AvatarProps> {}

  export interface ButtonProps {
    onClick?: () => void;
    appearance?: "default" | "minimal" | "primary";
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    height?: number;
    iconAfter?: string;
    iconBefore?: string;
    iconSize?: number;
    intent?: "none" | "success" | "warning" | "danger";
    isActive?: boolean;
    isLoading?: boolean;
    marginLeft?: number;
    marginRight?: number;
  }
  export class Button extends React.PureComponent<ButtonProps> {}

  export interface IconProps {
    icon: string;
    color?: string;
    size?: number;
    title?: string;
  }
  export class Icon extends React.PureComponent<IconProps> {}

  export interface IconButtonProps {
    icon: string;
    onClick?: () => void;
    appearance?: "default" | "minimal" | "primary";
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    height?: number;
    iconSize?: number;
    intent?: "none" | "success" | "warning" | "danger";
    isActive?: boolean;
    isLoading?: boolean;
    marginLeft?: number;
    marginRight?: number;
  }
  export class IconButton extends React.PureComponent<IconButtonProps> {}

  export interface SelectMenuProps {
    title: string;
    options: { label: string; value: string }[];
    className?: string;
    children?: React.ReactNode;
    isMultiSelect?: boolean;
    selected?: string | string[];
    height?: number;
    width?: number;
    onSelect?: (item: { label: string; value: string }) => void;
    onDeselect?: (item: { label: string; value: string }) => void;
  }
  export class SelectMenu extends React.PureComponent<SelectMenuProps> {}

  export interface SpinnerProps {
    className?: string;
    size?: number;
  }
  export class Spinner extends React.PureComponent<SpinnerProps> {}

  interface TableCellProps {
    children?: React.ReactNode;
    className?: string;
    display?: string;
    alignItems?: string;
    flexBasis?: number;
    flexGrow?: number;
    flexShrink?: number;
  }
  interface TableHeadProps {
    children?: React.ReactNode;
    className?: string;
    height?: number;
    width?: number;
  }
  interface TableRowProps {
    children?: React.ReactNode;
    className?: string;
    display?: string;
    alignItems?: string;
    flexBasis?: number;
    flexGrow?: number;
    flexShrink?: number;
  }
  interface TableSearchHeaderCellProps {
    className?: string;
    display?: string;
    alignItems?: string;
    flexBasis?: number;
    flexGrow?: number;
    flexShrink?: number;
  }
  interface TableVirtualBodyProps {
    children?: React.ReactNode;
    className?: string;
    estimatedItemSize?: number;
    height?: number;
    width?: number;
    onScroll?: (
      scrollTop: number,
      event: React.UIEvent<HTMLDivElement>
    ) => void;
    overscanCount?: number;
    useAverageAutoHeightEstimation?: boolean;
  }
  export interface TableProps {
    className?: string;
  }
  export class Table extends React.PureComponent<TableProps> {
    static Cell: (props: TableCell) => JSX.Element;
    static Head: (props: TableHead) => JSX.Element;
    static SearchHeaderCell: (props: TableSearchHeaderCell) => JSX.Element;
    static Row: (props: TableRow) => JSX.Element;
    static VirtualBody: (props: TableVirtualBodyProps) => JSX.Element;
  }
}
