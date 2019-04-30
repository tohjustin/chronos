import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = (props: ContainerProps) => (
  <div className="view-container">{props.children}</div>
);

export default Container;
