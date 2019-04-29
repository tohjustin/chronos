/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import { SidebarItem, SidebarItemProps } from "./SidebarItem";

interface SidebarProps {
  primaryItems: SidebarItemProps[];
  secondaryItems: SidebarItemProps[];
}

const Nav = styled.nav`
  background: #244360;
  color: #c0c9d1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  width: 80px;

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;

const Sidebar = (props: SidebarProps) => (
  <Nav>
    <ul className="sidebar-primary-items">
      {props.primaryItems.map(itemProps => (
        <li key={itemProps.text}>
          <SidebarItem {...itemProps} />
        </li>
      ))}
    </ul>
    <ul className="sidebar-secondary-items">
      {props.secondaryItems.map(itemProps => (
        <li key={itemProps.text}>
          <SidebarItem {...itemProps} />
        </li>
      ))}
    </ul>
  </Nav>
);

export default Sidebar;
