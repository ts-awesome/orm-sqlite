import {DbValueType} from '@viatsyshyn/ts-orm';

export interface ISqlQuery {
  sql: string
  params?: {[key: string]: DbValueType}
}

export interface IPgErrorResult {
  code: string;
  detail: string;
  name: string;
  error: string;
  table: string;
  constraint: string;
}

import { RunResult, Statement } from 'sqlite3';

export interface IDatabase  {
  close(callback?: (err: Error | null) => void): void;

  run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;

  all(sql: string, params: any, callback?: (this: Statement, err: Error | null, rows: any[]) => void): this;
}