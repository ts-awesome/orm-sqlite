export class DbError extends Error {
  public code: string;

  constructor(code: string, name?: string, message?: string, stack?: string) {
    super();

    this.code = code;
    this.name = name || "DB_ERROR";
    if (message) {
      this.message = message;
    }
    if (stack) {
      this.stack = stack;
    }

    Object.setPrototypeOf(this, DbError.prototype);
  }
}
