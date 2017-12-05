import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_disputed").then( (): PromiseLike<any> => {
    return knex.schema.createTable("reports_disputed", (table: Knex.CreateTableBuilder): void => {
      table.string("reporter", 42).notNullable();      
      table.string("disputedStakeToken", 42).primary().notNullable();
      table.string("marketID", 42).notNullable();
      table.string("marketReportingState", 30).notNullable();      
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_disputed");
};
