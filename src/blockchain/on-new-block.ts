import Augur from "augur.js";
import * as Knex from "knex";
import { logError } from "../utils/log-error";
import { BlocksRow } from "../types";

export function onNewBlock(db: Knex, augur: Augur, blockNumberString: string) {
  augur.rpc.eth.getBlockByNumber([blockNumberString, false], (block: any): void => {
    if (!block || block.error || !block.timestamp) return logError(new Error(JSON.stringify(block)));
    const blockNumber: number = parseInt(blockNumberString, 16);
    const blockTimestamp: number = parseInt(block.timestamp, 16);
    console.log("new block:", blockNumber, blockTimestamp);
    db.transaction((trx) => {
      const dataToInsert: {} = { blockNumber, blockTimestamp };
      db.transacting(trx).insert(dataToInsert).into("blocks").asCallback((err: Error|null): void => {
        if (err) {
          trx.rollback();
          logError(err);
        } else {
          trx.commit();
          logError(null);
        }
      });
    });
  });
}
