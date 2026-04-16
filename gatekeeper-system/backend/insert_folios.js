require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const foliosDePrueba = [
  'FOLIO-12345',
  'FOLIO-60001',
  'FOLIO-60002',
  'FOLIO-60003',
  'FOLIO-60004',
  'FOLIO-60005',
  'FOLIO-60006',
  'FOLIO-60007',
  'FOLIO-60008',
  'FOLIO-60009',
  'FOLIO-60010'
];

async function generarFolios() {
  console.log("⏳ Conectando a Base de Datos en Render...");
  let insertados = 0;
  
  for (const folio of foliosDePrueba) {
    try {
      // Inyectamos un monto falso para complacer a la base de datos
      await pool.query('INSERT INTO pagos_referencia (folio, estatus_pago, monto) VALUES ($1, $2, $3)', [folio, 'Pagado', 1500.00]);
      insertados++;
      console.log(`✅ Folio insertado: ${folio}`);
    } catch (err) {
      if (err.code === '23505') {
        console.log(`⚠️ Folio ya existía: ${folio}`);
      } else {
        // En caso de que la tabla no tenga estatus_pago pero sí exija monto
        try {
          await pool.query('INSERT INTO pagos_referencia (folio, monto) VALUES ($1, $2)', [folio, 1500.00]);
          insertados++;
          console.log(`✅ Folio insertado: ${folio}`);
        } catch (e2) {
           if (e2.code === '23505') {
             console.log(`⚠️ Folio ya existía: ${folio}`);
           } else {
             console.log(`❌ Error con ${folio}:`, e2.message);
           }
        }
      }
    }
  }
  
  console.log(`\n🎉 Proceso terminado. Se agregaron ${insertados} folios nuevos a tu base de datos.`);
  pool.end();
}

generarFolios();
