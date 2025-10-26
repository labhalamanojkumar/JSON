#!/usr/bin/env node
const mysql = require('mysql2/promise');

async function main() {
  const url = process.env.MYSQL_URL;
  if (!url) {
    console.log('MYSQL_URL not set');
    return;
  }
  const u = new URL(url);
  const conn = await mysql.createConnection({
    host: u.hostname,
    port: u.port ? parseInt(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    ssl: { rejectUnauthorized: false }
  });

  const [rows] = await conn.query('SELECT id, data FROM ad_providers');
  for (const row of rows) {
    let data;
    try {
      data = JSON.parse(row.data);
    } catch (e) {
      console.log('Invalid JSON for provider', row.id, 'fixing...');
      // Convert JavaScript object string to JSON
      let str = row.data.trim();
      // Replace single quotes with double quotes, but carefully
      str = str.replace(/'/g, '"');
      // Fix property names without quotes
      str = str.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      try {
        data = JSON.parse(str);
      } catch (e2) {
        console.log('Failed to fix JSON for', row.id);
        continue;
      }
      // Update the data to proper JSON
      await conn.query('UPDATE ad_providers SET data = ? WHERE id = ?', [JSON.stringify(data), row.id]);
      console.log('Fixed JSON for provider', row.id);
    }
    if (data.config && data.config.metaname && typeof data.config.metaname === 'string') {
      const metaname = data.config.metaname;
      // Check if it's a full meta tag
      const match = metaname.match(/content="([^"]+)"/);
      if (match) {
        data.config.metaname = match[1];
        console.log('Fixed metaname for provider', row.id, 'to', data.config.metaname);
        await conn.query('UPDATE ad_providers SET data = ? WHERE id = ?', [JSON.stringify(data), row.id]);
      }
    }
  }
  console.log('Fixed existing data');
  await conn.end();
}

main().catch(console.error);