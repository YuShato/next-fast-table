#!/usr/bin/env node

require('dotenv').config(); // Загрузка переменных окружения из .env файла

const { PrismaClient } = require("@prisma/client");
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const path = require('path');

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createClient();
const datas = require("./data.json");

async function main() {
  const START_ID = 0;

  try {
    const fileBuffer = await fs.readFile('./prisma/my-data.xlsx');
    console.log('Excel file read successfully');
    const myData = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = myData.SheetNames[0];
    const sheet = myData.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);
    console.log('Data converted to JSON successfully');

    jsonData.forEach((item, index) => {
      item.id = index;
      item.userYear = String(item.userYear);
    });

    const filePath = path.join(__dirname, 'data.json');

    try {
      await fs.access(filePath, fs.constants.F_OK);
      // File exists, replace it
      await fs.unlink(filePath);
      console.log('Existing data.json file deleted');
    } catch (err) {
      // File does not exist, no need to delete
    }

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    console.log('File data.json created/replaced in prisma folder');

    // Load the data from data.json
    const jsonDataFromFile = require('./data.json');
    console.log('Loaded data from data.json:', jsonDataFromFile);

    // Create the database tables
    await prisma.$connect();
    console.log('Connected to database');

    // Create the payments table
    await prisma.payment.createMany({
      data: jsonDataFromFile,
    });
    console.log('Created payments table with', jsonDataFromFile.length, 'records');

    // Disconnect from the database
    await prisma.$disconnect();
    console.log('Disconnected from database');
  } catch (e) {
    console.error('An error occurred in the main function:', e.message);
  }
}

main()
  .catch((e) => {
    console.error('An error occurred in the main execution:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
