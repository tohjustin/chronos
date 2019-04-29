import React from "react";
import { NavLink } from "react-router-dom";

export interface NavbarItemProps {
  featherIcon: React.ComponentType;
  text: string;
  to: string;
}

export const NavbarItem = (props: NavbarItemProps) => {
  return (
    <NavLink className="navbar-item" to={props.to}>
      <props.featherIcon />
      <span className="navbar-item__description">{props.text}</span>
    </NavLink>
  );
};
