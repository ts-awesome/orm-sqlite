import {SQLiteExecutor} from './executor';
import {ISqlQuery, IDatabase} from './interfaces';
import {injectable} from 'inversify';
import {ITransaction} from '@viatsyshyn/ts-orm';

@injectable()
export class SQLiteTransaction extends SQLiteExecutor implements ITransaction<ISqlQuery[]> {
  private isFinished = false;

  constructor(private conn: IDatabase) {
    super(conn);
  }

  public get finished(): boolean {
    return this.isFinished;
  }

  public async commit(): Promise<void> {
    if (this.finished) {
      throw new Error();
    }

    return new Promise((resolve, reject) => {
      this.conn.run('COMMIT', err => err ? reject(err) : resolve());
    });
  }

  public async rollback(): Promise<void> {
    if (this.finished) {
      throw new Error();
    }

    return new Promise((resolve, reject) => {
      this.conn.run('ROLLBACK', (err) => err ? reject(err) : resolve());
    });
  }
}
