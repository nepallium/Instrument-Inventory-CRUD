import { Client } from "pg";
import "dotenv/config";
import isLocal from "../utils/isLocal.js";

const createSQLTables = `
  CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL UNIQUE
  );
  
  CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_name TEXT NOT NULL UNIQUE,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL
    );

  CREATE TABLE IF NOT EXISTS instrument_categories (
    instrument_id UUID REFERENCES instruments(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (instrument_id, category_id)
  );
`;

const createBrands = `
  INSERT INTO brands (brand_name)
  VALUES
  ('Yamaha'), ('Fender'), ('Gibson'), ('Roland')
  ON CONFLICT (brand_name) DO NOTHING;
`;

const createCategories = `
  INSERT INTO categories (category_name)
  VALUES
  ('Reed'), ('Trumpet'), ('Saxophone'), ('Clarinet'), ('Piano'), ('Acoustic'), ('Electric'), ('Drums')
  ON CONFLICT (category_name) DO NOTHING;
`;

const createInstruments = `
  INSERT INTO instruments (instrument_name, brand_id)
  VALUES 
  -- Pianos (Grand, Baby, Upright)
  ('Yamaha C7X Progressive Grand Piano', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Yamaha GB1K Baby Grand Piano', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Yamaha U1 Professional Upright Piano', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Roland GP-609 Digital Grand', (SELECT id FROM brands WHERE brand_name = 'Roland')),
  
  -- Saxes (Alto, Soprano, Tenor)
  ('Yamaha YAS-280 Alto Saxophone', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Yamaha YSS-475II Soprano Saxophone', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Yamaha YTS-62 Professional Tenor Sax', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  
  -- Trumpets
  ('Yamaha YTR-2330 Standard Trumpet', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Yamaha YTR-8335RS Xeno Trumpet', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  
  -- Clarinets
  ('Yamaha YCL-255 Standard Clarinet', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Yamaha YCL-CSVR Custom Series', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  
  -- Guitars (Electric/Acoustic)
  ('Fender American Professional II Stratocaster', (SELECT id FROM brands WHERE brand_name = 'Fender')),
  ('Fender Acoustasonic Player Telecaster', (SELECT id FROM brands WHERE brand_name = 'Fender')),
  ('Gibson Les Paul Standard 60s', (SELECT id FROM brands WHERE brand_name = 'Gibson')),
  ('Gibson J-45 Standard Acoustic', (SELECT id FROM brands WHERE brand_name = 'Gibson')),
  
  -- Drums
  ('Yamaha Stage Custom Birch 5-piece', (SELECT id FROM brands WHERE brand_name = 'Yamaha')),
  ('Roland V-Drums TD-17KVX Electronic Kit', (SELECT id FROM brands WHERE brand_name = 'Roland'))

  ON CONFLICT (instrument_name) DO NOTHING;
`;

const linkInstrumentCategories = `
  INSERT INTO instrument_categories (instrument_id, category_id)
  VALUES
  -- Pianos (Acoustic & Electric mixes)
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha C7X Progressive Grand Piano'), (SELECT id FROM categories WHERE category_name = 'Piano')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha C7X Progressive Grand Piano'), (SELECT id FROM categories WHERE category_name = 'Acoustic')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha GB1K Baby Grand Piano'), (SELECT id FROM categories WHERE category_name = 'Piano')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha GB1K Baby Grand Piano'), (SELECT id FROM categories WHERE category_name = 'Acoustic')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha U1 Professional Upright Piano'), (SELECT id FROM categories WHERE category_name = 'Piano')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha U1 Professional Upright Piano'), (SELECT id FROM categories WHERE category_name = 'Acoustic')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Roland GP-609 Digital Grand'), (SELECT id FROM categories WHERE category_name = 'Piano')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Roland GP-609 Digital Grand'), (SELECT id FROM categories WHERE category_name = 'Electric')),

  -- Saxes & Clarinets (Woodwind / Reed mix)
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YAS-280 Alto Saxophone'), (SELECT id FROM categories WHERE category_name = 'Saxophone')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YAS-280 Alto Saxophone'), (SELECT id FROM categories WHERE category_name = 'Reed')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YSS-475II Soprano Saxophone'), (SELECT id FROM categories WHERE category_name = 'Saxophone')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YSS-475II Soprano Saxophone'), (SELECT id FROM categories WHERE category_name = 'Reed')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YTS-62 Professional Tenor Sax'), (SELECT id FROM categories WHERE category_name = 'Saxophone')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YTS-62 Professional Tenor Sax'), (SELECT id FROM categories WHERE category_name = 'Reed')),

  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YCL-255 Standard Clarinet'), (SELECT id FROM categories WHERE category_name = 'Clarinet')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YCL-255 Standard Clarinet'), (SELECT id FROM categories WHERE category_name = 'Reed')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YCL-CSVR Custom Series'), (SELECT id FROM categories WHERE category_name = 'Clarinet')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YCL-CSVR Custom Series'), (SELECT id FROM categories WHERE category_name = 'Reed')),

  -- Trumpets (Brass)
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YTR-2330 Standard Trumpet'), (SELECT id FROM categories WHERE category_name = 'Trumpet')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha YTR-8335RS Xeno Trumpet'), (SELECT id FROM categories WHERE category_name = 'Trumpet')),

  -- Guitars (Acoustic / Electric / Hybrid mix)
  ((SELECT id FROM instruments WHERE instrument_name = 'Fender American Professional II Stratocaster'), (SELECT id FROM categories WHERE category_name = 'Electric')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Fender Acoustasonic Player Telecaster'), (SELECT id FROM categories WHERE category_name = 'Electric')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Fender Acoustasonic Player Telecaster'), (SELECT id FROM categories WHERE category_name = 'Acoustic')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Gibson Les Paul Standard 60s'), (SELECT id FROM categories WHERE category_name = 'Electric')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Gibson J-45 Standard Acoustic'), (SELECT id FROM categories WHERE category_name = 'Acoustic')),

  -- Drums (Acoustic & Electronic mix)
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha Stage Custom Birch 5-piece'), (SELECT id FROM categories WHERE category_name = 'Drums')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Yamaha Stage Custom Birch 5-piece'), (SELECT id FROM categories WHERE category_name = 'Acoustic')),
  
  ((SELECT id FROM instruments WHERE instrument_name = 'Roland V-Drums TD-17KVX Electronic Kit'), (SELECT id FROM categories WHERE category_name = 'Drums')),
  ((SELECT id FROM instruments WHERE instrument_name = 'Roland V-Drums TD-17KVX Electronic Kit'), (SELECT id FROM categories WHERE category_name = 'Electric'))

  ON CONFLICT (instrument_id, category_id) DO NOTHING;
`;

async function main() {
  console.log("...seeding");

  const client = new Client({
    connectionString: process.argv[2],
    ssl: isLocal() ? false : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // start a transaction
    await client.query("BEGIN");

    await client.query(createSQLTables);
    console.log("tables created");
    await client.query(createBrands);
    await client.query(createCategories);
    await client.query(createInstruments);
    await client.query(linkInstrumentCategories);
    console.log("data created successfully");
    // If we got here, save all changes
    await client.query("COMMIT");
  } catch (error) {
    // If anything fails, undo everything
    await client.query("ROLLBACK");
    console.error("Error while populating db: " + error.message);
  } finally {
    await client.end();
    console.log("client ended.");
  }
}

main();
