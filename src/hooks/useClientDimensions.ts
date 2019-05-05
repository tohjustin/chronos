import React, { useCallback, useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

function useClientDimensions(): [
  (node: Element | null) => void,
  number,
  number
] {
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [refElement, setRefElement] = useState<React.RefObject<Element> | null>(
    null
  );
  const callbackRef = useCallback((node: Element | null) => {
    setRefElement(node !== null ? { current: node } : null);
  }, []);
  useEffect(() => {
    if (refElement && refElement.current) {
      const resizeObserver = new ResizeObserver(entries => {
        setContainerHeight(entries[0].target.clientHeight);
        setContainerWidth(entries[0].target.clientWidth);
      });
      resizeObserver.observe(refElement.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [refElement]);

  return [callbackRef, containerHeight, containerWidth];
}

export default useClientDimensions;
