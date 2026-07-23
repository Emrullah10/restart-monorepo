import { Pool } from 'pg';

export const makeDatasource = ({ host, port, database, user, password }) => {
  const pool = new Pool({ host, port, database, user, password });

  return {
    query: (text, params) => pool.query(text, params),
    pool,
  };
};
