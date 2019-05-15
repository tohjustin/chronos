import classNames from "classnames";
import React, { useRef } from "react";

import Button from "../Button";

import "./styles.scss";

interface FileUploadButtonProps {
  accept: string;
  buttonType: "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton = (props: FileUploadButtonProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Button
      className={classNames("file-upload-btn", props.className)}
      type={props.buttonType}
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
