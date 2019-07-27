import classNames from "classnames";
import React from "react";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header = (props: HeaderProps) => (
  <div className={classNames("view__header", props.className)}>
    {props.children}
  </div>
);

export default Header;
