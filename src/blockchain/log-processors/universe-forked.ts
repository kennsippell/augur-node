import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processUniverseForkedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: UniverseForked");
  console.log(log);
  callback(null);
}

export function processUniverseForkedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: UniverseForked removal");
  console.log(log);
  augurEmitter.emit("UniverseForked", log);
  callback(null);
}
