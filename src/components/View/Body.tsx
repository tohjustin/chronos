import React from "react";

interface BodyProps {
  children: React.ReactNode;
}

const Body = (props: BodyProps) => (
  <div className="view-body">{props.children}</div>
);

export default Body;
