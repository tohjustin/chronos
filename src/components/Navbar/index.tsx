import classNames from "classnames";
import React from "react";

import { NavbarItem, NavbarItemProps } from "./NavbarItem";
import logo from "./logo.svg";

import "./styles.scss";

interface NavbarProps {
  primaryItems: NavbarItemProps[];
  secondaryItems: NavbarItemProps[];
  className?: string;
}

const Navbar = (props: NavbarProps) => (
  <nav className={classNames("navbar", props.className)}>
    <ul>
      <li>
        <div className="navbar__logo-container">
          <img alt="logo" src={logo} />
        </div>
      </li>
      {props.primaryItems.map(itemProps => (
        <li key={itemProps.text}>
          <NavbarItem {...itemProps} />
        </li>
      ))}
    </ul>
    <ul>
      {props.secondaryItems.map(itemProps => (
        <li key={itemProps.text}>
          <NavbarItem {...itemProps} />
        </li>
      ))}
    </ul>
  </nav>
);

export default Navbar;
