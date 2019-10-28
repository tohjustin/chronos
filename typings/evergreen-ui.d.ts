/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any */
/**
 * Typings obtained from https://github.com/segmentio/evergreen/issues/300
 */

declare module "evergreen-ui" {
  import * as React from "react";

  type PositionTypes =
    | "top"
    | "top-left"
    | "top-right"
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "left"
    | "right";
  type IntentTypes = "none" | "success" | "warning" | "danger";
  type IconNameTypes =
    | ""
    | "add-column-left"
    | "add-column-right"
    | "add-row-bottom"
    | "add-row-top"
    | "add-to-artifact"
    | "add-to-folder"
    | "add"
    | "airplane"
    | "align-center"
    | "align-justify"
    | "align-left"
    | "align-right"
    | "alignment-bottom"
    | "alignment-horizontal-center"
    | "alignment-left"
    | "alignment-right"
    | "alignment-top"
    | "alignment-vertical-center"
    | "annotation"
    | "application"
    | "applications"
    | "arrow-bottom-left"
    | "arrow-bottom-right"
    | "arrow-down"
    | "arrow-left"
    | "arrow-right"
    | "arrow-top-left"
    | "arrow-top-right"
    | "arrow-up"
    | "arrows-horizontal"
    | "arrows-vertical"
    | "asterisk"
    | "automatic-updates"
    | "badge"
    | "ban-circle"
    | "bank-account"
    | "barcode"
    | "blank"
    | "blocked-person"
    | "bold"
    | "book"
    | "bookmark"
    | "box"
    | "briefcase"
    | "build"
    | "calculator"
    | "calendar"
    | "camera"
    | "caret-down"
    | "caret-left"
    | "caret-right"
    | "caret-up"
    | "cell-tower"
    | "changes"
    | "chart"
    | "chat"
    | "chevron-backward"
    | "chevron-down"
    | "chevron-forward"
    | "chevron-left"
    | "chevron-right"
    | "chevron-up"
    | "circle-arrow-down"
    | "circle-arrow-left"
    | "circle-arrow-right"
    | "circle-arrow-up"
    | "circle"
    | "citation"
    | "clipboard"
    | "cloud-download"
    | "cloud-upload"
    | "cloud"
    | "code-block"
    | "code"
    | "cog"
    | "collapse-all"
    | "column-layout"
    | "comment"
    | "comparison"
    | "compass"
    | "compressed"
    | "confirm"
    | "console"
    | "contrast"
    | "control"
    | "credit-card"
    | "cross"
    | "crown"
    | "curved-range-chart"
    | "cut"
    | "dashboard"
    | "database"
    | "delete"
    | "delta"
    | "derive-column"
    | "desktop"
    | "diagram-tree"
    | "direction-left"
    | "direction-right"
    | "disable"
    | "document-open"
    | "document-share"
    | "document"
    | "dollar"
    | "dot"
    | "double-caret-horizontal"
    | "double-caret-vertical"
    | "double-chevron-down"
    | "double-chevron-left"
    | "double-chevron-right"
    | "double-chevron-up"
    | "doughnut-chart"
    | "download"
    | "drag-handle-horizontal"
    | "drag-handle-vertical"
    | "draw"
    | "drive-time"
    | "duplicate"
    | "edit"
    | "eject"
    | "endorsed"
    | "envelope"
    | "eraser"
    | "error"
    | "euro"
    | "exchange"
    | "exclude-row"
    | "expand-all"
    | "export"
    | "eye-off"
    | "eye-on"
    | "eye-open"
    | "fast-backward"
    | "fast-forward"
    | "feed-subscribed"
    | "feed"
    | "film"
    | "filter-keep"
    | "filter-list"
    | "filter-remove"
    | "filter"
    | "flag"
    | "flame"
    | "flash"
    | "floppy-disk"
    | "flows"
    | "folder-close"
    | "folder-new"
    | "folder-open"
    | "folder-shared-open"
    | "folder-shared"
    | "follower"
    | "following"
    | "font"
    | "fork"
    | "form"
    | "full-circle"
    | "full-stacked-chart"
    | "fullscreen"
    | "function"
    | "gantt-chart"
    | "geolocation"
    | "geosearch"
    | "git-branch"
    | "git-commit"
    | "git-merge"
    | "git-new-branch"
    | "git-pull"
    | "git-push"
    | "git-repo"
    | "glass"
    | "globe-network"
    | "globe"
    | "graph-remove"
    | "graph"
    | "grid-view"
    | "grid"
    | "group-objects"
    | "grouped-bar-chart"
    | "hand-down"
    | "hand-left"
    | "hand-right"
    | "hand-up"
    | "hand"
    | "header-one"
    | "header-two"
    | "header"
    | "headset"
    | "heart-broken"
    | "heart"
    | "heat-grid"
    | "heatmap"
    | "help"
    | "helper-management"
    | "highlight"
    | "history"
    | "home"
    | "horizontal-bar-chart-asc"
    | "horizontal-bar-chart-desc"
    | "horizontal-bar-chart"
    | "horizontal-distribution"
    | "id-number"
    | "image-rotate-left"
    | "image-rotate-right"
    | "import"
    | "inbox"
    | "info-sign"
    | "inner-join"
    | "insert"
    | "intersection"
    | "ip-address"
    | "issue-closed"
    | "issue-new"
    | "issue"
    | "italic"
    | "join-table"
    | "key-backspace"
    | "key-command"
    | "key-control"
    | "key-delete"
    | "key-enter"
    | "key-escape"
    | "key-option"
    | "key-shift"
    | "key-tab"
    | "key"
    | "known-vehicle"
    | "label"
    | "layer"
    | "layers"
    | "layout-auto"
    | "layout-balloon"
    | "layout-circle"
    | "layout-grid"
    | "layout-group-by"
    | "layout-hierarchy"
    | "layout-linear"
    | "layout-skew-grid"
    | "layout-sorted-clusters"
    | "layout"
    | "left-join"
    | "lightbulb"
    | "link"
    | "list-detail-view"
    | "list"
    | "locate"
    | "lock"
    | "log-in"
    | "log-out"
    | "manual"
    | "manually-entered-data"
    | "map-create"
    | "map-marker"
    | "map"
    | "maximize"
    | "media"
    | "menu-closed"
    | "menu-open"
    | "menu"
    | "merge-columns"
    | "merge-links"
    | "minimize"
    | "minus"
    | "mobile-phone"
    | "mobile-video"
    | "moon"
    | "more"
    | "mountain"
    | "move"
    | "mugshot"
    | "multi-select"
    | "music"
    | "new-grid-item"
    | "new-link"
    | "new-object"
    | "new-person"
    | "new-prescription"
    | "new-text-box"
    | "ninja"
    | "notifications"
    | "numbered-list"
    | "numerical"
    | "office"
    | "offline"
    | "oil-field"
    | "one-column"
    | "outdated"
    | "page-layout"
    | "panel-stats"
    | "panel-table"
    | "paperclip"
    | "paragraph"
    | "path-search"
    | "path"
    | "pause"
    | "people"
    | "percentage"
    | "person"
    | "phone"
    | "pie-chart"
    | "pin"
    | "pivot-table"
    | "pivot"
    | "play"
    | "plus"
    | "polygon-filter"
    | "power"
    | "predictive-analysis"
    | "prescription"
    | "presentation"
    | "print"
    | "projects"
    | "properties"
    | "property"
    | "publish-function"
    | "pulse"
    | "random"
    | "record"
    | "redo"
    | "refresh"
    | "regression-chart"
    | "remove-column-left"
    | "remove-column-right"
    | "remove-column"
    | "remove-row-bottom"
    | "remove-row-top"
    | "remove"
    | "repeat"
    | "resolve"
    | "rig"
    | "right-join"
    | "ring"
    | "rotate-document"
    | "rotate-page"
    | "satellite"
    | "saved"
    | "scatter-plot"
    | "search-around"
    | "search-template"
    | "search-text"
    | "search"
    | "segmented-control"
    | "select"
    | "selection"
    | "send-to-graph"
    | "send-to-map"
    | "send-to"
    | "series-add"
    | "series-configuration"
    | "series-derived"
    | "series-filtered"
    | "series-search"
    | "settings"
    | "share"
    | "shield"
    | "shop"
    | "shopping-cart"
    | "sim-card"
    | "slash"
    | "small-cross"
    | "small-minus"
    | "small-plus"
    | "small-tick"
    | "snowflake"
    | "social-media"
    | "sort-alphabetical-desc"
    | "sort-alphabetical"
    | "sort-asc"
    | "sort-desc"
    | "sort-numerical-desc"
    | "sort-numerical"
    | "sort"
    | "split-columns"
    | "square"
    | "stacked-chart"
    | "star-empty"
    | "star"
    | "step-backward"
    | "step-chart"
    | "step-forward"
    | "stop"
    | "strikethrough"
    | "style"
    | "swap-horizontal"
    | "swap-vertical"
    | "symbol-circle"
    | "symbol-cross"
    | "symbol-diamond"
    | "symbol-square"
    | "symbol-triangle-down"
    | "symbol-triangle-up"
    | "tag"
    | "take-action"
    | "taxi"
    | "text-highlight"
    | "th-derived"
    | "th-list"
    | "th"
    | "thumbs-down"
    | "thumbs-up"
    | "tick-circle"
    | "tick"
    | "time"
    | "timeline-area-chart"
    | "timeline-bar-chart"
    | "timeline-events"
    | "timeline-line-chart"
    | "tint"
    | "torch"
    | "train"
    | "translate"
    | "trash"
    | "tree"
    | "trending-down"
    | "trending-up"
    | "two-columns"
    | "underline"
    | "undo"
    | "ungroup-objects"
    | "unknown-vehicle"
    | "unlock"
    | "unpin"
    | "unresolve"
    | "updated"
    | "upload"
    | "user"
    | "variable"
    | "vertical-bar-chart-asc"
    | "vertical-bar-chart-desc"
    | "vertical-distribution"
    | "video"
    | "volume-down"
    | "volume-off"
    | "volume-up"
    | "walk"
    | "warning-sign"
    | "waterfall-chart"
    | "widget-button"
    | "widget-footer"
    | "widget-header"
    | "widget"
    | "wrench"
    | "zoom-in"
    | "zoom-out"
    | "zoom-to-fit";

  interface BoxBackground {
    background?: string;
    backgroundBlendMode?: string;
    backgroundClip?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOrigin?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
  }

  interface BoxBorderRadius {
    borderBottomLeftRadius?: string | number;
    borderBottomRightRadius?: string | number;
    borderRadius?: string | number;
    borderTopLeftRadius?: string | number;
    borderTopRightRadius?: string | number;
  }

  interface BoxBorders {
    border?: string;
    borderBottom?: string;
    borderBottomColor?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string | number;
    borderColor?: string;
    borderLeft?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string | number;
    borderRight?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string | number;
    borderStyle?: string;
    borderTop?: string;
    borderTopColor?: string;
    borderTopStyle?: string;
    borderTopWidth?: string | number;
    borderWidth?: string | number;
  }

  interface BoxShadow {
    boxShadow?: string;
  }

  interface BoxDimensions {
    height?: string | number;
    maxHeight?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    minWidth?: string | number;
    width?: string | number;
  }

  interface BoxFlex {
    alignContent?: string;
    alignItems?: string;
    alignSelf?: string;
    flex?: string | number;
    flexBasis?: string | number;
    flexDirection?: string;
    flexFlow?: string;
    flexGrow?: string | number;
    flexShrink?: string | number;
    flexWrap?: string;
    justifyContent?: string;
    justifyItems?: string;
    justifySelf?: string;
    order?: string | number;
    placeContent?: string;
    placeItems?: string;
    placeSelf?: string;
  }

  interface BoxGrid {
    columnGap?: string | number;
    gap?: string | number;
    grid?: string;
    gridArea?: string;
    gridAutoColumns?: string | number;
    gridAutoFlow?: string;
    gridAutoRows?: string | number;
    gridColumn?: string | number;
    gridColumnEnd?: string | number;
    gridColumnGap?: string | number;
    gridColumnStart?: string | number;
    gridGap?: string | number;
    gridRow?: string | number;
    gridRowEnd?: string | number;
    gridRowGap?: string | number;
    gridRowStart?: string | number;
    gridTemplate?: string;
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    rowGap?: string | number;
  }

  interface BoxInteraction {
    cursor?: string;
    pointerEvents?: string;
    userSelect?: string;
    visibility?: string;
  }

  interface BoxLayout {
    boxSizing?: string;
    clear?: string;
    clearfix?: boolean;
    display?:
      | "block"
      | "contents"
      | "flex"
      | "grid"
      | "inherit"
      | "initial"
      | "inline"
      | "inline-block"
      | "inline-flex"
      | "inline-grid"
      | "inline-table"
      | "list-item"
      | "none"
      | "table"
      | "table-caption"
      | "table-cell"
      | "table-columnr"
      | "table-column-group"
      | "table-header-group"
      | "table-footer-group"
      | "table-row"
      | "table-row-group"
      | "";
    float?: string;
    zIndex?: number;
  }

  interface BoxList {
    listStyle?: string;
    listStyleType?: string;
    listStyleImage?: string;
    listStylePosition?: string;
  }

  interface BoxOpacity {
    opacity?: string | number;
  }

  interface BoxOverflow {
    overflow?:
      | "auto"
      | "hidden"
      | "inherit"
      | "initial"
      | "revert"
      | "scroll"
      | "unset"
      | "visible";
    overflowX?:
      | "auto"
      | "hidden"
      | "inherit"
      | "initial"
      | "revert"
      | "scroll"
      | "unset"
      | "visible";
    overflowY?:
      | "auto"
      | "hidden"
      | "inherit"
      | "initial"
      | "revert"
      | "scroll"
      | "unset"
      | "visible";
  }

  interface BoxPosition {
    bottom?: string | number;
    left?: string | number;
    position?:
      | "absolute"
      | "fixed"
      | "inherit"
      | "initial"
      | "relative"
      | "revert"
      | "static"
      | "sticky"
      | "unset";
    right?: string | number;
    top?: string | number;
  }

  interface BoxSpacing {
    margin?: string | number;
    marginBottom?: string | number;
    marginLeft?: string | number;
    marginRight?: string | number;
    marginTop?: string | number;
    marginX?: string | number;
    marginY?: string | number;
    padding?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    paddingTop?: string | number;
    paddingX?: string | number;
    paddingY?: string | number;
  }

  interface BoxText {
    color?: string;
    font?: string;
    fontFamily?: string;
    fontSize?: string | number;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string | number;
    letterSpacing?: string | number;
    lineHeight?: string | number;
    textAlign?:
      | "center"
      | "end"
      | "inherit"
      | "justify"
      | "left"
      | "match-parent"
      | "revert"
      | "right"
      | "start"
      | "unset";
    textDecoration?: string;
    textOverflow?: string;
    textShadow?: string;
    textTransform?: string;
    whiteSpace?: string;
    wordBreak?: string;
    wordWrap?: string;
  }

  interface BoxTransform {
    transform?: string;
    transformOrigin?: string;
  }

  interface BoxTransition {
    transition?: string;
    transitionDelay?: string;
    transitionDuration?: string;
    transitionProperty?: string;
    transitionTimingFunction?: string;
  }

  interface UiBoxPropsType
    extends BoxBackground,
      BoxBorderRadius,
      BoxBorders,
      BoxShadow,
      BoxDimensions,
      BoxFlex,
      BoxGrid,
      BoxInteraction,
      BoxLayout,
      BoxList,
      BoxOpacity,
      BoxOverflow,
      BoxPosition,
      BoxSpacing,
      BoxText,
      BoxTransform,
      BoxTransition {
    is?: React.ReactNode;
    to?: string;
    className?: string;
    css?: object;
    style?: object;
    innerRef?: (ref: HTMLElement) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void;
  }

  export interface AlertProps
    extends BoxDimensions,
      BoxLayout,
      BoxPosition,
      BoxSpacing {
    intent: IntentTypes;
    title?: React.ReactNode;
    hasTrim?: boolean;
    hasIcon?: boolean;
    isRemoveable?: boolean;
    onRemove?: () => void;
    appearance?: "default" | "card";
    children?: React.ReactNode;
  }

  export class Alert extends React.PureComponent<AlertProps> {}

  // https://github.com/downshift-js/downshift
  export interface AutocompleteProps {
    title?: React.ReactNode;
    items: any[];
    itemToString?: (i: any) => string;
    children: (props: {
      toggle: () => void;
      getRef: (ref: React.RefObject) => void;
      isShown: NonNullable<PopoverProps["isShown"]>;
      getInputProps: () => {
        onKeyDown: (e: React.ChangeEvent<any>) => void;
        onChange: (e: React.ChangeEvent<any>) => void;
        onBlur: (e: React.ChangeEvent<any>) => void;
      };
      openMenu: () => any;
      inputValue: string;
    }) => React.ReactNode;
    itemSize?: number;
    position?: PositionTypes;
    isFilterDisabled?: boolean;
    popoverMinWidth?: number;
    popoverMaxHeight?: number;
    selectedItem?: any;
    buttonProps?: buttonProps;
    onChange: (selectedItem: any) => void;
  }

  export class Autocomplete extends React.PureComponent<AutocompleteProps> {}

  export interface AvatarProps {
    className?: string;
    src?: string;
    size?: number;
    name?: string;
    hashValue?: string;
    isSolid?: boolean;
    color?: string;
    getInitials?: (name: string) => string;
    forceShowInitials?: boolean;
    sizeLimitOneCharacter?: number;
  }

  export class Avatar extends React.PureComponent<AvatarProps> {}

  export interface CheckboxProps
    extends BoxDimensions,
      BoxLayout,
      BoxPosition,
      BoxSpacing,
      TextProps {
    id?: string;
    name?: string;
    label?: React.ReactNode;
    value?: string;
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (e: React.ChangeEvent<string>) => void;
    disabled?: boolean;
    isInvalid?: boolean;
    appearance?: "default";
  }

  export class Checkbox extends React.PureComponent<CheckboxProps> {}

  export interface ButtonProps
    extends BoxDimensions,
      BoxLayout,
      BoxPosition,
      BoxSpacing,
      TextProps {
    type?: "submit" | "button";
    intent?: IntentTypes;
    appearance?: "default" | "minimal" | "primary";
    isLoading?: boolean;
    isActive?: boolean;
    iconBefore?: IconNameTypes;
    iconAfter?: IconNameTypes;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    onClick?: (e: React.ChangeEvent<any>) => void | false | undefined;
  }

  export class Button extends React.PureComponent<ButtonProps> {}

  export class Card extends React.PureComponent<PaneProps> {}

  export interface IconProps {
    color?: string;
    icon: IconNameTypes;
    size?: number;
    title?: string;
    style?: Record<string, string | number>;
  }

  export class Icon extends React.PureComponent<IconProps> {}

  export interface FormFieldProps
    extends BoxDimensions,
      BoxSpacing,
      BoxPosition,
      BoxLayout {
    label: NonNullable<React.ReactNode>;
    labelFor?: string;
    description?: React.ReactNode;
    hint?: React.ReactNode;
    validationMessage?: React.ReactNode;
  }

  export class FormField extends React.PureComponent<FormFieldProps> {}

  export class FormFieldDescription extends React.PureComponent<
    ParagraphProps
  > {}

  export class FormFieldHint extends React.PureComponent<ParagraphProps> {}

  export interface FormFieldLabelProps extends LabelProps {
    isAstrixShown?: boolean;
  }

  export class FormFieldLabel extends React.PureComponent<
    FormFieldLabelProps
  > {}

  export interface FormFieldValidationMessageProps extends PaneProps {
    children?: React.ReactNode;
  }

  export class FormFieldValidationMessage extends React.PureComponent<
    FormFieldValidationMessageProps
  > {}

  export interface IconButtonProps extends ButtonProps {
    icon: IconNameTypes;
    iconAim?: "down" | "up";
    iconSize?: number;
  }

  export class IconButton extends React.PureComponent<IconButtonProps> {}

  export interface LabelProps extends TextProps {
    htmlFor?: string;
    className?: string;
  }

  export class Label extends React.PureComponent<LabelProps> {}

  export interface MenuProps {
    children: React.ReactNode | React.ReactNode[];
    className?: string;
  }
  export interface MenuGroupProps {
    children: React.ReactNode | React.ReactNode[];
  }
  export interface MenuItemProps {
    is?: string | (() => void);
    onSelect?: () => void;
    icon?: React.JSX;
    children?: React.JSX;
    secondaryText?: React.JSX;
    appearance?: "default";
    intent?: IntentTypes;
  }
  export interface MenuOptionProps<T> {
    appearance: "default";
    isSelected: boolean;
    id: string;
    onSelect?: (newValue: any) => void;
    children?: ReactNode;
    secondaryText?: ReactNode;
  }
  export interface MenuOptionsGroupProps<T> {
    selected: T | null;
    options: {
      label: number;
      value: T;
    }[];
    onChange?: (newValue: T) => void;
    title?: ReactNode;
  }

  export class Menu extends React.PureComponent<MenuProps> {
    public static Group = class MenuGroup extends React.PureComponent<
      MenuGroupProps
    > {};
    public static Item = class MenuItem extends React.PureComponent<
      MenuItemProps
    > {};
    public static Divider = class MenuDivider extends React.PureComponent {};
    public static Option = class MenuOption extends React.PureComponent<
      MenuOptionProps
    > {};
    public static OptionsGroup = class MenuOptionsGroup extends React.PureComponent<
      MenuOptionsGroupProps
    > {};
  }

  export interface PaneProps extends UiBoxPropsType {
    background?:
      | "tint1"
      | "tint2"
      | "overlay"
      | "yellowTint"
      | "greenTint"
      | "orangeTint"
      | "redTint"
      | "blueTint"
      | "purpleTint"
      | "tealTint";
    elevation?: 0 | 1 | 2 | 3 | 4;
    hoverElevation?: 0 | 1 | 2 | 3 | 4;
    activeElevation?: 0 | 1 | 2 | 3 | 4;
    border?: string | boolean;
    borderTop?: string | boolean;
    borderRight?: string | boolean;
    borderBottom?: string | boolean;
    borderLeft?: string | boolean;
  }

  export class Pane extends React.PureComponent<PaneProps> {}

  interface PopoverStatelessProps extends PaneProps {
    children?: React.ReactNode;
  }

  export interface PopoverProps {
    position?: PositionTypes;
    isShown?: boolean;
    trigger?: "click" | "hover";
    content:
      | React.ReactNode
      | ((object: { close: () => void }) => React.ReactNode);
    children:
      | ((props: {
          toggle: () => void;
          getRef: (ref: React.RefObject) => void;
          isShow: NonNullable<PopoverProps["isShown"]>;
        }) => React.ReactNode)
      | React.ReactNode;
    display?: string;
    minWidth?: number | string;
    minHeight?: number | string;
    animationDuration?: number;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenComplete?: () => void;
    onCloseComplete?: () => void;
    onBodyClick?: () => void;
    bringFocusInside?: boolean;
    shouldCloseOnExternalClick?: boolean;
    statelessProps?: PopoverStatelessProps;
  }

  export class Popover extends React.PureComponent<PopoverProps> {}

  export interface ParagraphProps extends UiBoxPropsType {
    size?: 300 | 400 | 500;
    fontFamily?: "ui" | "display" | "mono";
  }

  export class Paragraph extends React.PureComponent<ParagraphProps> {}

  export interface PositionerProps {
    position?: PositionTypes;
    isShown?: boolean;

    children: (params: {
      top: number;
      left: number;
      zIndex: NonNullable<StackProps["value"]>;
      css;
      style: {
        transformOrigin: string;
        left: number;
        top: number;
        zIndex: NonNullable<StackProps["value"]>;
      };
      getRef: (ref: React.RefObject) => void;
      animationDuration: PositionerProps["animationDuration"];
      state: "exited" | "entering" | "entered" | "exiting";
    }) => React.ReactNode;
    innerRef?: (ref: React.RefObject) => void;
    bodyOffset?: number;
    targetOffset?: number;
    target: (params: {
      getRef: () => React.RefObject;
      isShow: boolean;
    }) => React.ReactNode;
    initialScale?: number;
    animationDuration?: number;
    onCloseComplete?: () => void;
    onOpenComplete?: () => void;
  }

  export class Positioner extends React.PureComponent<PositionerProps> {}

  export interface RadioProps
    extends BoxSpacing,
      BoxPosition,
      BoxLayout,
      BoxDimensions {
    id?: string;
    name?: string;
    label?: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<any>) => void;
    disabled?: boolean;
    checked?: boolean;
    size?: 12 | 16;
    isRequired?: boolean;
    isInvalid?: boolean;
    appearance?: "default";
  }

  export class Radio extends React.PureComponent<RadioProps> {}

  export interface RadioGroupProps
    extends BoxSpacing,
      BoxPosition,
      BoxLayout,
      BoxDimensions {
    options: Array<{
      label: React.ReactNode;
      value: string;
      isDisabled?: boolean;
    }>;
    value?: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    label?: string;
    size?: 12 | 16;
    isRequired?: boolean;
  }

  export class RadioGroup extends React.PureComponent<RadioGroupProps> {}

  export class SearchInput extends React.PureComponent<TextInputProps> {}

  export interface SegmentedControlProps
    extends BoxSpacing,
      BoxPosition,
      BoxLayout,
      BoxDimensions {
    options: Array<{
      label: string;
      value: NonNullable<SegmentedControlProps["value"]>;
    }>;
    value?: number | string | boolean;
    defaultValue?: number | string | boolean;
    onChange: (value: NonNullable<SegmentedControlProps["value"]>) => void;
    name?: string;
    height?: number;
  }

  export class SegmentedControl extends React.PureComponent<
    SegmentedControlProps
  > {}

  export interface SelectMenuProps {
    className?: string;
    title?: string;
    width?: string | number;
    height?: string | number;
    options: Array<{ label: string; value: string | null }>;
    onSelect?: (item: { label: string; value: string }) => void;
    onDeselect?: (item: { label: string; value: string }) => void;
    selected?: string | string[];
    isMultiSelect?: boolean;
    hasTitle?: boolean;
    hasFilter?: boolean;
    filterPlaceholder?: string;
    filterIcon?: IconNameTypes;
    onFilterChange?: (searchValue: string) => void;
    position?: Omit<PositionTypes, "left" | "right">;
    detailView?: PopoverProps["content"];
    titleView?:
      | React.ReactNode
      | ((titleViewProps: {
          close?: () => void;
          headerHeight?: string | number;
          title?: string;
        }) => React.ReactNode);
    emptyView?: React.ReactNode | (() => React.ReactNode);
    closeOnSelect?: boolean;
    statelessProps?: PopoverStatelessProps;
  }

  export class SelectMenu extends React.PureComponent<SelectMenuProps> {}

  export interface SideSheetProps {
    children: React.ReactNode | (() => React.ReactNode);
    isShown?: boolean;
    onCloseComplete?: () => void;
    onOpenComplete?: () => void;
    onBeforeClose?: () => void;
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEscapePress?: boolean;
    width?: string | number;
    containerProps?: PaneProps;
    position?: Pick<PositionTypes, "top" | "bottom" | "left" | "right">;
    preventBodyScrolling?: boolean;
  }

  export class SideSheet extends React.PureComponent<SideSheetProps> {}

  export interface SidebarTabProps extends TabProps {}

  export class SidebarTab extends React.PureComponent<SidebarTabProps> {}

  export interface StackProps {
    children: (zIndex: number) => React.ReactNode;
    value?: number;
  }

  export class Stack extends React.PureComponent<StackProps> {}

  export interface TabProps extends TextProps {
    onSelect?: () => void;
    isSelected?: boolean;
    disabled?: boolean;
    appearance?: "default";
  }

  export class Tab extends React.PureComponent<TabProps> {}

  export interface TablistProps extends UiBoxPropsType {}

  export class Tablist extends React.PureComponent<TablistProps> {}

  export interface TabNavigationProps extends UiBoxPropsType {}

  export class TabNavigation extends React.PureComponent<TabNavigationProps> {}

  export interface TextProps extends UiBoxPropsType {
    size?: 100 | 200 | 300 | 400 | 500 | 600;
    fontFamily?: "ui" | "display" | "mono";
  }

  export class Text extends React.PureComponent<TextProps> {}

  export interface HeadingProps extends UiBoxPropsType {
    size?: 100 | 200 | 300 | 400 | 500 | 600;
    fontFamily?: "ui" | "display" | "mono";
  }

  export class Heading extends React.PureComponent<HeadingProps> {}

  export interface TextInputProps extends TextProps {
    id?: string;
    name?: string;
    type?: "text" | "number" | "hidden";
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    isInvalid?: boolean;
    spellCheck?: boolean;
    placeholder?: string;
    appearance?: "default" | "primary";
    width?: string | number;
    className?: string;
    value?: string | number;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    min?: string;
    max?: string;
  }

  export class TextInput extends React.PureComponent<TextInputProps> {}

  export interface TextInputFieldProps extends TextInputProps, FormFieldProps {
    inputHeight?: number;
    inputWidth?: number | string;
  }

  export class TextInputField extends React.PureComponent<
    TextInputFieldProps
  > {}

  export interface TooltipProps extends TextProps {
    children: React.ReactNode;
    content: React.ReactNode;
    appearance?: "default" | "card";
    position?: PositionTypes;
    hideDelay?: number;
    isShown?: boolean;
    statelessProps?: PopoverStatelessProps;
  }

  export class Tooltip extends React.PureComponent<TooltipProps> {}

  export interface SpinnerProps extends UiBoxPropsType {
    delay?: number;
    size: number;
  }

  export class Spinner extends React.PureComponent<SpinnerProps> {}

  interface TableCellProps extends UiBoxPropsType {
    children?: React.ReactNode;
    className?: string;
  }
  interface TableHeadProps extends UiBoxPropsType {
    children?: React.ReactNode;
    className?: string;
  }
  interface TableRowProps extends UiBoxPropsType {
    children?: React.ReactNode;
    className?: string;
  }
  interface TableSearchHeaderCellProps extends UiBoxPropsType {
    className?: string;
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

  export const defaultTheme: any;
  export const ThemeProvider: React.Provider<typeof defaultTheme>;
}
