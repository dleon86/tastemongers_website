import { Pool } from 'pg';
import { dbConfig } from '../config/database';

// Define types for process.env without using namespace
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USER: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
    }
  }
}

const pool = new Pool(dbConfig);

export default pool; 