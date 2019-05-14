import { useEffect, useState } from "react";

function useStorageEstimate(): [number, number] {
  const [storageQuota, setStorageQuota] = useState(0);
  const [storageUsage, setStorageUsage] = useState(0);
  useEffect(() => {
    async function fetchStorageEstimate() {
      if (navigator.storage && navigator.storage.estimate) {
        const { quota = 0, usage = 0 } = await navigator.storage.estimate();
        setStorageQuota(quota);
        setStorageUsage(usage);
      } else {
        console.error("[useStorageEstimate] StorageManager not found");
      }
    }
    fetchStorageEstimate();
  }, []);

  return [storageUsage, storageQuota];
}

export default useStorageEstimate;
