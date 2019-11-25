import Dexie from "dexie";

import { RawActivity } from "../models/activity";
import { getBrowserFavIconUrl } from "../utils/imageUtils";

import {
  DomainTableRecord,
  TitleTableRecord,
  ActivityTableRecord
} from "./types";

/**
 * Exports all records `T` in the given Dexie table into an array.
 *
 * @param table Dexie table to export data from
 * @returns extracted array of records
 */
export function exportTableRecords<T>(
  table: Dexie.Table<T, number>
): Promise<T[]> {
  return table.toCollection().toArray();
}

/**
 * Extracts activity data from URL object.
 *
 * @param url `URL` object
 * @param iconUrl favIcon URL of visited page
 * @returns extracted activity data
 */
export function getActivityData(
  url: URL,
  iconUrl: string
): {
  domain: string;
  path: string;
  favIconUrl: string;
} {
  if (url.origin !== "null") {
    new Error(`[db] ${url} is not a valid URL.`);
  }

  let domain = `${url.protocol}//${url.hostname}`;
  let path = `${url.pathname}${url.hash}${url.search}`;
  let favIconUrl = iconUrl;
  switch (url.protocol) {
    case "about:":
    case "brave:":
    case "chrome:":
    case "edge:":
    case "opera:":
      domain = `${url.protocol}//`;
      path = `${url.hostname}${url.pathname}${url.hash}${url.search}`;
      favIconUrl = getBrowserFavIconUrl();
      break;
    case "chrome-extension:":
    case "extension:":
    case "moz-extension:":
      domain = url.origin;
      break;
    case "http:":
    case "https:":
      domain = `https://${url.hostname}`;
      break;
    default:
      new Error(`[db] ${url} is not a valid URL. (unrecognized protocol)`);
      break;
  }

  return { domain, path, favIconUrl };
}

/**
 * Creates a URL
 *
 * @param activity activity table record
 * @returns URL string
 */
export function createUrl(activity: ActivityTableRecord): string {
  return `${activity.domain}${activity.path}`;
}

/**
 * Creates database records from a given raw segment of web browsing activity
 */
export function generateRecords({
  url: rawUrl,
  favIconUrl: iconUrl,
  title,
  startTime,
  endTime
}: RawActivity): {
  activity: ActivityTableRecord;
  domain: DomainTableRecord;
  title?: TitleTableRecord;
} {
  const urlObject = new URL(rawUrl);
  const { domain, path, favIconUrl } = getActivityData(urlObject, iconUrl);
  const activity = { domain, path, startTime, endTime };
  const url = createUrl(activity);

  return {
    activity,
    domain: { id: domain, favIconUrl },
    title: title !== "" ? { id: url, title } : undefined
  };
}
