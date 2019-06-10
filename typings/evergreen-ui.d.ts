declare module "evergreen-ui" {
  import * as React from "react";

  export interface ButtonProps {
    appearance?: "default" | "minimal" | "primary";
    children?: React.ReactNode;
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

  export interface IconButtonProps {
    icon: string;
    appearance?: "default" | "minimal" | "primary";
    children?: React.ReactNode;
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
    className: string;
    title: string;
    options: { label: string; value: string }[];
    children?: React.ReactNode;
    isMultiSelect?: boolean;
    selected?: string | string[];
    height?: number;
    width?: number;
    onSelect?: (item: { label: string; value: string }) => void;
    onDeselect?: (item: { label: string; value: string }) => void;
  }
  export class SelectMenu extends React.PureComponent<SelectMenuProps> {}
}
