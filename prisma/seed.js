//seed

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const datas = require("./data.json");

const xlsx = require('xlsx');
const fs = require('fs');
const chokidar = require('chokidar');
// 08.10
const path = require('path');

async function main() {
  const START_ID = 0;

  const fileBuffer = fs.readFileSync('./prisma/my-data.xlsx');
  const myData = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = myData.SheetNames[0];
  const sheet = myData.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  jsonData.forEach((item, index) => {
    item.id = index;
    // item.userYear = String(item.userYear);
  });

  // 08.10
  const path = require('path');
  
  // ...
  
  const filePath = path.join(__dirname, 'data.json');
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create it
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log('File data.json created in prisma folder');
        }
      });
    } else {
      // File exists, replace it
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), function (err) {
            if (err) {
              console.error(err);
            } else {
              console.log('File data.json replaced in prisma folder');
            }
          });
        }
      });
    }
  });

  // 08.10 конец
  
  // 07.10
  async function createDatabaseFromJson() {
    // Load the data from data.json
    const jsonData = require('./data.json');
    console.log('Loaded data from data.json:', jsonData);

    // Create a new Prisma client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    console.log('Created Prisma client');

    // Create the database tables
    await prisma.$connect();
    console.log('Connected to database');

    // Create the payments table
    await prisma.payment.createMany({
      data: jsonData,
    });
    console.log('Created payments table with', jsonData.length, 'records');

    // Disconnect from the database
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }

  // Call the function
  createDatabaseFromJson()
    .catch((e) => {
      console.error(e.message);
    });
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });