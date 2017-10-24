import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("markets").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("markets", [{
      marketID: "0x0000000000000000000000000000000000000001",
      universe: "0x000000000000000000000000000000000000000b",
      marketType: "categorical",
      numOutcomes: 8,
      minPrice: "0",
      maxPrice: "1",
      marketCreator: "0x0000000000000000000000000000000000000b0b",
      creationTime: 1506473474,
      creationBlockNumber: 1400000,
      creationFee: "10",
      reportingFeeRate: "0.02",
      marketCreatorFeeRate: "0.01",
      category: "test category",
      tag1: "test tag 1",
      tag2: "test tag 2",
      volume: "0",
      sharesOutstanding: "0",
      marketStateID: null,
      reportingWindow: "0x1000000000000000000000000000000000000000",
      endTime: 1506573470,
      shortDescription: "This is a categorical test market created by b0b.",
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
      designatedReportStake: "10",
      resolutionSource: "http://www.trusted-third-party.com",
      numTicks: 24,
    }, {
      marketID: "0x0000000000000000000000000000000000000002",
      universe: "0x000000000000000000000000000000000000000b",
      marketType: "binary",
      numOutcomes: 2,
      minPrice: "0",
      maxPrice: "1",
      marketCreator: "0x0000000000000000000000000000000000000b0b",
      creationTime: 1506480000,
      creationBlockNumber: 1400100,
      creationFee: "10",
      reportingFeeRate: "0.02",
      marketCreatorFeeRate: "0.01",
      category: "test category",
      tag1: "test tag 1",
      tag2: "test tag 2",
      volume: "0",
      sharesOutstanding: "0",
      marketStateID: null,
      reportingWindow: "0x1000000000000000000000000000000000000000",
      endTime: 1506573480,
      shortDescription: "This is a binary test market created by b0b.",
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
      designatedReportStake: "10",
      resolutionSource: "http://www.trusted-third-party.com",
      numTicks: 2,
    }, {
      marketID: "0x0000000000000000000000000000000000000003",
      universe: "0x000000000000000000000000000000000000000b",
      marketType: "binary",
      numOutcomes: 2,
      minPrice: "0",
      maxPrice: "1",
      marketCreator: "0x000000000000000000000000000000000000d00d",
      creationTime: 1506480015,
      creationBlockNumber: 1400101,
      creationFee: "10",
      reportingFeeRate: "0.02",
      marketCreatorFeeRate: "0.01",
      category: "test category",
      tag1: "test tag 1",
      tag2: "test tag 2",
      volume: "0",
      sharesOutstanding: "0",
      marketStateID: null,
      reportingWindow: "0x1000000000000000000000000000000000000000",
      endTime: 1506573500,
      shortDescription: "This is another binary test market created by d00d.",
      designatedReporter: "0x000000000000000000000000000000000000d00d",
      designatedReportStake: "10",
      resolutionSource: "http://www.ttp-inc.com/0000000000000000000000000000000000000003",
      numTicks: 16,
    },
    {
      marketID: "0x0000000000000000000000000000000000000011",
      universe: "0x000000000000000000000000000000000000000b",
      marketType: "categorical",
      numOutcomes: 8,
      minPrice: "0",
      maxPrice: "1",
      marketCreator: "0x0000000000000000000000000000000000000b0b",
      creationTime: 1507473474,
      creationBlockNumber: 1400000,
      creationFee: "10",
      reportingFeeRate: "0.02",
      marketCreatorFeeRate: "0.01",
      category: "test category",
      tag1: "test tag 1",
      tag2: "test tag 2",
      volume: "0",
      sharesOutstanding: "0",
      marketStateID: 1,
      reportingWindow: "0x1000000000000000000000000000000000000000",
      endTime: 1507573470,
      shortDescription: "This is a categorical test market created by b0b awaiting round 1 reporting.",
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
      designatedReportStake: "10",
      resolutionSource: "http://www.trusted-third-party.com",
      numTicks: 24,
    }], 1000);
  });
};
