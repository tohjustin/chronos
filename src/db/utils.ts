import Dexie from "dexie";

/**
 * Exports all records `T` in the given Dexie table into an array & strip off
 * the `id` value in each record if present.
 *
 * @param {Dexie.Table<T, number>} table Dexie table to export data from
 * @returns {Promise<T[]>} extracted array of records
 */
export async function exportTableRecords<T extends { id?: number }>(
  table: Dexie.Table<T, number>
): Promise<T[]> {
  const activityData = await table.toCollection().toArray();
  return activityData.map(record => {
    if (record.id) {
      delete record.id;
    }
    return record;
  });
}
