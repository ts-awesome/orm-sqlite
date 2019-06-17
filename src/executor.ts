import {Database, RunResult} from 'sqlite3';
import * as yesql from 'yesql';

import {IQueryData, IQueryExecutor} from "@viatsyshyn/ts-orm";
import {injectable} from "inversify";
import {ISqlQuery} from "./interfaces";
import {
  DbError,
  DUPLICATE_VALUE_DB_ERROR_CODE,
  DuplicateValueDbError,
  FK_VIOLATES_DB_ERROR_CODE,
  FkViolatedDbError
} from "./errors";

// //Add TIME_STAMPT parser
// const TIME_STAMPT_CODE = 1114;
// (<any>types).setTypeParser(TIME_STAMPT_CODE, (val: string) => {
//   return new Date(val.replace(' ', 'T') + 'Z');
// });

@injectable()
export class SQLiteExecutor implements IQueryExecutor<ISqlQuery> {

  constructor(private executor: Database) {}


  public async execute<TResult>(sqlQuery: ISqlQuery): Promise<IQueryData[]> {
    if (!sqlQuery || !sqlQuery.sql || sqlQuery.sql.trim() === "") {
      return Promise.reject(new Error("sqlQuery is not provided"));
    }
    if (!sqlQuery.params) {
      sqlQuery.params = {};
    }

    return new Promise((resolve, reject) => {
      this.executor.run(sqlQuery.sql, sqlQuery.params, function (err: Error) {
        if (err) {
          reject(err);
        } else {
          const result: IQueryData[] = [];
          this.each((err, row) => {
            if (err) {
              reject(err);
            } else {
              result.push(row);
            }
          }, (err, count) =>{
            if (err) {
              reject(err);
            } else {
              console.log('Query complete. Read count', count);
              resolve(result);
            }
          });
        }
      });
    });
  }


  // public async execute<TResult>(sqlQuery: ISqlQuery): Promise<IQueryData[]> {

  //   // if (!sqlQuery || !sqlQuery.sql || sqlQuery.sql.trim() === "") {
  //   //   return Promise.reject(new Error("sqlQuery is not provided"));
  //   // }

  //   // if (!sqlQuery.params) {
  //   //   sqlQuery.params = {};
  //   // }

  //   // let fixedSql = yesql.pg(sqlQuery.sql)(sqlQuery.params);


    
  //   // try {
  //   //   let res = await this.db.run
  //   //   return res.rows;
  //   // } catch (err) {
  //   //   switch (err.code) {
  //   //     case DUPLICATE_VALUE_DB_ERROR_CODE:
  //   //       throw new DuplicateValueDbError(err);
  //   //     case FK_VIOLATES_DB_ERROR_CODE:
  //   //       throw new FkViolatedDbError(err.detail, err.error);
  //   //     default:
  //   //       throw new DbError(err.code, undefined, err.detail, err.error);
  //   //   }
  //   // }
  // }
}
