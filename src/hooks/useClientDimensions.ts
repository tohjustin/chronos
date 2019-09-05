import React, { useCallback, useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

function useClientDimensions(): [
  (node: Element | null) => void,
  {
    top: number;
    left: number;
    height: number;
    width: number;
  }
] {
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0
  });
  const [refElement, setRefElement] = useState<React.RefObject<Element> | null>(
    null
  );
  const callbackRef = useCallback((node: Element | null) => {
    setRefElement(node !== null ? { current: node } : null);
  }, []);
  useEffect(() => {
    if (
      refElement &&
      refElement.current &&
      refElement.current.getBoundingClientRect
    ) {
      const { top, left } = refElement.current.getBoundingClientRect();
      const resizeObserver = new ResizeObserver(entries => {
        setDimensions({
          top,
          left,
          height: entries[0].target.clientHeight,
          width: entries[0].target.clientWidth
        });
      });
      resizeObserver.observe(refElement.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [refElement]);

  return [callbackRef, dimensions];
}

export default useClientDimensions;
