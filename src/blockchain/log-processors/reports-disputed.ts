import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";

// 21:    event ReportsDisputed(address indexed universe, 
// address indexed disputer, 
// address indexed market, 
// IMarket.ReportingState 
// reportingPhase, uint256 disputeBondAmount);

export function processReportsDisputedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const query = trx("market_state").first(["market_state.reportingState as reportingState", "stakeToken"]).join("reports", "market_state.marketID", "reports.marketID")
  query.where({"markets.marketID": log.market, "reports.marketReportingState": augur.constants.ReportingState.DESIGNATED_REPORTING }).asCallback( (err: Error|null, { reportingState }: {reportingState: string}): void => {
    if (err) return callback(err);
    const reportDataToInsert: { [index: string]: string|number|boolean } = {
      marketID: log.market,
      stakeToken: log.stakeToken,
      blockNumber: log.blockNumber,
      reporter: log.reporter,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      amountStaked: log.amountStaked,
      marketReportingState: reportingState,
      claimed: 0,
    };
    db.transacting(trx).insert(reportDataToInsert).into("reports").asCallback(callback);
  });
}

export function processReportsDisputedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: ReportsDisputed removal");
  console.log(log);
  callback(null);
}
