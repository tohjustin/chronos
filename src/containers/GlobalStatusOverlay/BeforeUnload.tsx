import { useCallback, useEffect } from "react";

const BeforeUnload = () => {
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // Chrome requires `returnValue` to be set
  }, []);
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  return null;
};

export default BeforeUnload;
