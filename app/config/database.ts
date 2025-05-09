export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  // Force SSL off if DB_FORCE_NO_SSL is true, otherwise use NODE_ENV for production SSL
  ssl: process.env.DB_FORCE_NO_SSL === 'true' 
    ? false 
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
}; 