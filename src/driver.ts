import { Database } from 'sqlite3';

import { ISqlDataDriver, ISqlTransaction } from '@viatsyshyn/ts-orm';
import { SQLiteExecutor } from './executor';
import { SQLiteTransaction } from './transaction';
import { injectable } from 'inversify';
import { ISqlQuery } from './interfaces';


@injectable()
export class SQLiteDriver extends SQLiteExecutor
  implements ISqlDataDriver<ISqlQuery[]> {
  constructor(
    private readonly db: Database
  ) {
    super(db);
  }

  public async begin(): Promise<ISqlTransaction<ISqlQuery[]>> {
    return new Promise((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', err => {
        if (err) {
          reject(err);
        } else { 
          resolve(new SQLiteTransaction(this.db));
        }
      });
    });
  }

  public end(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close(err => err ? reject(err) : resolve());
    });
  }
}
