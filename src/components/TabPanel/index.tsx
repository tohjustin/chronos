import classNames from "classnames";
import React from "react";

import "./styles.scss";

interface TabPanelProps {
  options: string[];
  selectedIndex: number;
  onSelect: (selectedIndex: number) => void;
}

const TabPanel = (props: TabPanelProps) => (
  <div className="tab-panel">
    {props.options.map((option, index) => (
      <div
        className={classNames("tab", { active: index === props.selectedIndex })}
        onClick={() => {
          props.onSelect(index);
        }}
        key={option}
      >
        {option}
      </div>
    ))}
  </div>
);

export default TabPanel;
