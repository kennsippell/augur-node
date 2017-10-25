import * as Knex from "knex";
import { Address } from "../../types";
import { sortDirection } from "../../utils/sort-direction";
import { getMarketsWithReportingState } from "./get-market-info";


// Look up reporting summary values. Should take reportingWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reportingState (DESIGNATED_REPORTING, FIRST_DISPUTE, LAST_REPORTING), etc.
export function getReportingSummary(db: Knex, reportingWindow: Address, callback: (err: Error|null, result?: any) => void): void {
  const queryData: { [id: string]: any } = (reportingWindow != null) ? { reportingWindow } : {};

  getMarketsWithReportingState(db).where(queryData).asCallback( (err: Error|null, value: any) => {
    console.log(value);
    callback(null, queryData);
  });

}
