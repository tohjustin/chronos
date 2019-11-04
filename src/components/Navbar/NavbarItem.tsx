import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

export interface NavbarItemProps extends Pick<NavLinkProps, "to"> {
  icon: React.ReactNode;
  text: string;
}

export const NavbarItem = (props: NavbarItemProps) => {
  return (
    <NavLink className="navbar-item" to={props.to}>
      {props.icon}
      <span className="navbar-item__description">{props.text}</span>
    </NavLink>
  );
};
