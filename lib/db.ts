// lib/db.ts
// MySQL database connection utility (without Prisma)

import mysql, { type ResultSetHeader, type ExecuteValues } from 'mysql2/promise';

/** Values bound to the `?` placeholders of a parameterized query */
export type QueryValues = ExecuteValues[];

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'pishro_password',
  database: process.env.DB_NAME || 'pishro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
};

const missingDbEnv = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'].filter(
  (key) => !process.env[key]
);

if (missingDbEnv.length > 0) {
  console.warn(
    `[DB] Missing env vars: ${missingDbEnv.join(', ')}. Using fallback DB config for ${dbConfig.user}@${dbConfig.host}/${dbConfig.database}`
  );
}

const pool = mysql.createPool(dbConfig);

function logDbError(operation: string, error: unknown) {
  console.error(`[DB] ${operation} failed`, {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    missingDbEnv,
    error,
  });
}

async function withConnection<T>(
  operation: string,
  work: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();

  try {
    return await work(connection);
  } catch (error) {
    logDbError(operation, error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Execute a SELECT query
 */
export async function query<T>(sql: string, values?: QueryValues): Promise<T[]> {
  return withConnection('query', async (connection) => {
    const [rows] = await connection.execute(sql, values);
    return rows as T[];
  });
}

/**
 * Execute a single row SELECT query
 */
export async function queryOne<T>(sql: string, values?: QueryValues): Promise<T | null> {
  const rows = await query<T>(sql, values);
  return rows[0] || null;
}

/**
 * Execute INSERT, UPDATE, DELETE query
 */
export async function execute(
  sql: string,
  values?: QueryValues
): Promise<{ insertId?: number; affectedRows: number }> {
  return withConnection('execute', async (connection) => {
    const [result] = await connection.execute(sql, values);
    const header = result as ResultSetHeader;
    return {
      insertId: header.insertId,
      affectedRows: header.affectedRows,
    };
  });
}

/**
 * Close the pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
