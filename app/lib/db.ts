import { Pool } from 'pg';
import { dbConfig } from '../config/database';

// Extend ProcessEnv interface for TypeScript type checking
declare global {
  interface ProcessEnv {
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
  }
}

const pool = new Pool(dbConfig);

export default pool; 