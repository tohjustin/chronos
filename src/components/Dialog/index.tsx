import classNames from "classnames";
import { Dialog as EvergreenDialog, DialogProps } from "evergreen-ui";
import _ from "lodash";
import React from "react";

import "./styles.scss";

const Dialog = (props: Omit<DialogProps, "hasHeader" | "hasFooter">) => {
  return (
    <EvergreenDialog
      {...props}
      containerProps={{
        ...props.containerProps,
        className: classNames(
          "dialog",
          _.get(props.containerProps, "className")
        )
      }}
    />
  );
};

export default Dialog;
