import { IQueryDriver, ITransaction } from '@ts-awesome/orm';
import { SQLiteExecutor } from './executor';
import { SQLiteTransaction } from './transaction';
import { injectable } from 'inversify';
import { ISqlQuery, IDatabase } from './interfaces';


@injectable()
export class SQLiteDriver extends SQLiteExecutor
  implements IQueryDriver<ISqlQuery[]> {
  constructor(
    private readonly db: IDatabase
  ) {
    super(db);
  }

  public async begin(): Promise<ITransaction<ISqlQuery[]>> {
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
