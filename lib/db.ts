// lib/db.ts
// MySQL database connection utility (without Prisma)

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'pishro_password',
  database: process.env.DB_NAME || 'pishro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

/**
 * Execute a SELECT query
 */
export async function query<T>(sql: string, values?: any[]): Promise<T[]> {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, values);
    connection.release();
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single row SELECT query
 */
export async function queryOne<T>(sql: string, values?: any[]): Promise<T | null> {
  try {
    const rows = await query<T>(sql, values);
    return rows[0] || null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute INSERT, UPDATE, DELETE query
 */
export async function execute(sql: string, values?: any[]): Promise<{ insertId?: number; affectedRows: number }> {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(sql, values);
    connection.release();
    return {
      insertId: (result as any).insertId,
      affectedRows: (result as any).affectedRows,
    };
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

/**
 * Close the pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
