require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

client.connect()
  .then(() => {
    console.log('✅ Connected successfully');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Current time:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
  });