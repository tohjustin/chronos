import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

export interface NavbarItemProps extends Pick<NavLinkProps, "to"> {
  featherIcon: React.ComponentType;
  text: string;
}

export const NavbarItem = (props: NavbarItemProps) => {
  return (
    <NavLink className="navbar-item" to={props.to}>
      <props.featherIcon />
      <span className="navbar-item__description">{props.text}</span>
    </NavLink>
  );
};
