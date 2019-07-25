import {IQueryData, IQueryExecutor} from '@viatsyshyn/ts-orm';
import {injectable} from 'inversify';
import {ISqlQuery, IDatabase} from './interfaces';
import {
  DbError,
} from './errors';


@injectable()
export class SQLiteExecutor implements IQueryExecutor<ISqlQuery[]> {

  constructor(private executor: IDatabase) {}


  public async execute(sqlQueries: ISqlQuery[]): Promise<IQueryData[]> {

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
      this.executor.all(sql, params, (err: Error, rows: any) => err ? reject(err) : resolve(rows));
    });
  }
}
