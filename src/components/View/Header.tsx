import React from "react";

interface HeaderProps {
  children: React.ReactNode;
}

const Header = (props: HeaderProps) => (
  <div className="view-header">{props.children}</div>
);

export default Header;
