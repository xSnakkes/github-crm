export enum PostgresErrorCode {
  UniqueViolation = '23505',
  UniqueError = 'SequelizeUniqueConstraintError',
  ForeignKeyViolation = '23503',
}
