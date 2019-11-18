import React, { useRef } from "react";

import { Button } from "../Button";

import "./styles.scss";

interface FileUploadButtonProps {
  accept: string;
  appearance?: "default" | "minimal" | "primary";
  className?: string;
  children?: React.ReactNode;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton = (props: FileUploadButtonProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Button
      appearance={props.appearance}
      className="file-upload-button"
      height={props.height}
      iconBefore="import"
      marginLeft={props.marginLeft}
      marginRight={props.marginRight}
      onClick={() => {
        if (ref !== null && ref.current !== null) {
          ref.current.click();
        }
      }}
    >
      <input
        ref={ref}
        type="file"
        accept={props.accept}
        onChange={props.onChange}
      />
      {props.children}
    </Button>
  );
};

export default FileUploadButton;
