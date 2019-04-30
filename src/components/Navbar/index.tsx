import React from "react";

import { NavbarItem, NavbarItemProps } from "./NavbarItem";

import "./styles.scss";
import logo from "./logo.svg";

interface NavbarProps {
  primaryItems: NavbarItemProps[];
  secondaryItems: NavbarItemProps[];
}

const Navbar = (props: NavbarProps) => (
  <nav className="navbar">
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
