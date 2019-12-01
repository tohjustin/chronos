import classNames from "classnames";
import React from "react";

import { NavbarItem, NavbarItemProps } from "./NavbarItem";
import logo from "./logo.svg";

import "./styles.scss";

interface NavbarProps {
  primaryItems: NavbarItemProps[];
  secondaryItems: NavbarItemProps[];
  className?: string;
  isDisabled?: boolean;
}

const Navbar = ({
  primaryItems,
  secondaryItems,
  className,
  isDisabled
}: NavbarProps) => (
  <nav className={classNames("navbar", className)}>
    <ul>
      <li>
        <div className="navbar__logo-container">
          <img alt="logo" src={logo} />
        </div>
      </li>
      {!isDisabled &&
        primaryItems.map(itemProps => (
          <li key={itemProps.text}>
            <NavbarItem {...itemProps} />
          </li>
        ))}
    </ul>
    <ul>
      {!isDisabled &&
        secondaryItems.map(itemProps => (
          <li key={itemProps.text}>
            <NavbarItem {...itemProps} />
          </li>
        ))}
    </ul>
  </nav>
);

export default Navbar;
