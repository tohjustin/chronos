import { Opaque } from "../../utils/typeUtils";

export type DateString = Opaque<"DATE_STRING:YYYY-MM-DD", string>;

export type Datum = {
  day: DateString;
  value: number | null;
};
