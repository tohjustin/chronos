import Dexie from "dexie";

/**
 * Exports all records `T` in the given Dexie table into an array.
 *
 * @param table Dexie table to export data from
 * @returns extracted array of records
 */
export function exportTableRecords<T extends { id?: number }>(
  table: Dexie.Table<T, number>
): Promise<T[]> {
  return table.toCollection().toArray();
}
