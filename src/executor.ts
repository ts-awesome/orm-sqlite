import {Database} from 'sqlite3';
import {IQueryData, IQueryExecutor} from '@viatsyshyn/ts-orm';
import {injectable} from 'inversify';
import {ISqlQuery} from './interfaces';
import {
  DbError,
  DUPLICATE_VALUE_DB_ERROR_CODE,
  DuplicateValueDbError,
  FK_VIOLATES_DB_ERROR_CODE,
  FkViolatedDbError
} from './errors';

// //Add TIME_STAMPT parser
// const TIME_STAMPT_CODE = 1114;
// (<any>types).setTypeParser(TIME_STAMPT_CODE, (val: string) => {
//   return new Date(val.replace(' ', 'T') + 'Z');
// });

@injectable()
export class SQLiteExecutor implements IQueryExecutor<ISqlQuery[]> {

  constructor(private executor: Database) {}


  public async execute<TResult>(sqlQueries: ISqlQuery[]): Promise<IQueryData[]> {

    if (!sqlQueries || sqlQueries.length === 0) {
      return Promise.reject(new Error('sqlQueries is empty'));
    }
    let result: any[] = []
    for (let i = 0; i < sqlQueries.length; i++) {
      if (!sqlQueries[i] || !sqlQueries[i].sql || sqlQueries[i].sql.trim() === '') {
        return Promise.reject(new Error(`sqlQuery ${i} is not provided`));
      }
      if (!sqlQueries[i].params) {
        sqlQueries[i].params = {};
      }
      try {
        result = await this.promisefiedAll(sqlQueries[i].sql, sqlQueries[i].params);
      } catch (err) {
        throw new DbError(err.code, undefined, err);
      }
    }
    return result
  }

  private promisefiedAll(sql: string, params: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.executor.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
  }


  // public async execute<TResult>(sqlQuery: ISqlQuery): Promise<IQueryData[]> {

  //   // if (!sqlQuery || !sqlQuery.sql || sqlQuery.sql.trim() === '') {
  //   //   return Promise.reject(new Error('sqlQuery is not provided'));
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
