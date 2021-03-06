import * as _ from "lodash";
import * as Knex from "knex";
import { Address, JoinedReportsMarketsRow, UIReport } from "../../types";
import { queryModifier } from "./database";

interface UIReports {
  [universe: string]: {
    [marketID: string]: Array<UIReport>,
  };
}

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take reporter (address) as a required parameter and take market, universe, and reportingWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export function getReportingHistory(db: Knex, reporter: Address, universe: Address|null, marketID: Address|null, reportingWindow: Address|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  // { universe: { marketID: { marketID, reportingWindow, payoutNumerators, isCategorical, isScalar, isIndeterminate } } }
  if (universe == null && marketID == null && reportingWindow == null) return callback(new Error("Must provide reference to universe, specify universe, marketID, or reportingWindow"));
  const query = db.select([
    "reports.transactionHash",
    "reports.logIndex",
    "reports.blockNumber as creationBlockNumber",
    "blocks.blockHash",
    "blocks.timestamp as creationTime",
    "reports.marketID",
    "reports.marketReportingState",
    "markets.universe",
    "markets.reportingWindow",
    "reports.stakeToken",
    "reports.amountStaked",
    "reportingState",
    "stake_tokens.isInvalid",
    "stake_tokens.payout0",
    "stake_tokens.payout1",
    "stake_tokens.payout2",
    "stake_tokens.payout3",
    "stake_tokens.payout4",
    "stake_tokens.payout5",
    "stake_tokens.payout6",
    "stake_tokens.payout7",
  ]).from("reports").join("markets", "markets.marketID", "reports.marketID").where({reporter});
  query.join("stake_tokens", "reports.stakeToken", "stake_tokens.stakeToken");
  query.join("blocks", "blocks.blockNumber", "reports.blockNumber");
  if (marketID != null) query.where("reports.marketID", marketID);
  if (universe != null) query.where("universe", universe);
  if (reportingWindow != null) query.where("reportingWindow", reportingWindow);
  if (earliestCreationTime != null) query.where("creationTime", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("creationTime", "<=", latestCreationTime);
  queryModifier(query, "reportID", "asc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, joinedReportsMarketsRows?: Array<JoinedReportsMarketsRow>): void => {
    if (err) return callback(err);
    if (!joinedReportsMarketsRows) return callback(new Error("Internal error retrieving reporting history"));
    const reports: UIReports = {};
    joinedReportsMarketsRows.forEach((row: JoinedReportsMarketsRow): void => {
      if (!reports[row.universe]) reports[row.universe] = {};
      if (!reports[row.universe][row.marketID]) reports[row.universe][row.marketID] = [];
      const payoutNumerators: Array<string|number|null> = [row.payout0, row.payout1, row.payout2, row.payout3, row.payout4, row.payout5, row.payout6, row.payout7].filter((payout: string|number|null): boolean => payout != null);
      const report: UIReport = {
        transactionHash: row.transactionHash,
        logIndex: row.logIndex,
        creationBlockNumber: row.creationBlockNumber,
        creationTime: row.creationTime,
        blockHash: row.blockHash,
        marketID: row.marketID,
        marketReportingState: row.marketReportingState,
        reportingWindow: row.reportingWindow,
        payoutNumerators,
        amountStaked: row.amountStaked,
        stakeToken: row.stakeToken,
        isCategorical: row.marketType === "categorical",
        isScalar: row.marketType === "scalar",
        isIndeterminate: Boolean(row.isInvalid),
        isSubmitted: true,
      };
      reports[row.universe][row.marketID].push(report);
    });
    callback(null, reports);
  });
}
