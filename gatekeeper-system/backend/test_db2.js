const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {}
);

async function run() {
  try {
    const result = await pool.query('SELECT * FROM pagos_referencia LIMIT 5');
    console.log(JSON.stringify(result.rows));
  } catch (err) {
    if (err.code === '42P01') {
      try {
        console.log("No table pagos_referencia. Checking tables...");
        const tables = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
        console.log(JSON.stringify(tables.rows));
      } catch (e) { console.error(e.message); }
    } else {
      console.error("DB error:", err.message);
    }
  } finally {
    pool.end();
  }
}
run();
