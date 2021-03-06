"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getReportingHistory } = require("../../../build/server/getters/get-reporting-history");

describe("server/getters/get-reporting-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getReportingHistory(db, t.params.reporter, t.params.universe, t.params.marketID, t.params.reportingWindow, t.params.earliestCreationTime, t.params.latestCreationTime, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, reportingHistory) => {
          t.assertions(err, reportingHistory);
          done();
        });
      });
    });
  };
  test({
    description: "get reporter history that actually exists",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {
        "0x000000000000000000000000000000000000000b": {
          "0x0000000000000000000000000000000000000011": [{
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D00",
            logIndex: 0,
            creationBlockNumber: 1400051,
            blockHash: "0x1400051",
            creationTime: 1506474500,
            marketID: "0x0000000000000000000000000000000000000011",
            marketReportingState: "DESIGNATED_REPORTING",
            reportingWindow: "0x1000000000000000000000000000000000000000",
            payoutNumerators: [0, 2],
            amountStaked: 17,
            stakeToken: "0x0000000000000000001000000000000000000001",
            isCategorical: false,
            isScalar: false,
            isIndeterminate: false,
            isSubmitted: true,
          }],
          "0x0000000000000000000000000000000000000019": [{
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D03",
            logIndex: 0,
            creationBlockNumber: 1400052,
            blockHash: "0x1400052",
            creationTime: 1506474515,
            marketID: "0x0000000000000000000000000000000000000019",
            marketReportingState: "FIRST_REPORTING",
            reportingWindow: "0x1000000000000000000000000000000000000000",
            payoutNumerators: [1, 1],
            amountStaked: 229,
            stakeToken: "0x0000000000000000001000000000000000000003",
            isCategorical: false,
            isScalar: false,
            isIndeterminate: false,
            isSubmitted: true,
          }],
        },
      });
    },
  });
  test({
    description: "get reporter history that actually exists, filtered by date",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000021",
      earliestCreationTime: 1506474501,
      latestCreationTime: 1506474515,
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {
        "0x000000000000000000000000000000000000000b": {
          "0x0000000000000000000000000000000000000019": [{
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D03",
            logIndex: 0,
            creationBlockNumber: 1400052,
            blockHash: "0x1400052",
            creationTime: 1506474515,
            marketID: "0x0000000000000000000000000000000000000019",
            marketReportingState: "FIRST_REPORTING",
            reportingWindow: "0x1000000000000000000000000000000000000000",
            payoutNumerators: [1, 1],
            amountStaked: 229,
            stakeToken: "0x0000000000000000001000000000000000000003",
            isCategorical: false,
            isScalar: false,
            isIndeterminate: false,
            isSubmitted: true,
          }],
        },
      });
    },
  });
  test({
    description: "reporter has not submitted any reports",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x2100000000000000000000000000000000000021",
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {});
    },
  });
});
