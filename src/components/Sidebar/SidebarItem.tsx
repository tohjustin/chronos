/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import { NavLink } from "react-router-dom";

export interface SidebarItemProps {
  featherIcon: React.ComponentType;
  text: string;
  to: string;
}

const NavItem = styled(NavLink)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 72px;

  &.active {
    background: #379af7;
    color: #ffffff;
  }

  svg {
    height: 20px;
    width: 20px;
  }

  .description {
    margin-top: 8px;
    text-align: center;
    width: 100%;
  }
`;

export const SidebarItem = (props: SidebarItemProps) => {
  return (
    <NavItem className="sidebar-item" to={props.to}>
      <props.featherIcon />
      <div className="description">{props.text}</div>
    </NavItem>
  );
};
