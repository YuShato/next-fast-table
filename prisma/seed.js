//seed

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const datas = require("./data.json");
// новое
// const xlsx = require('xlsx');
// const Papa = require('papaparse');




// async function main() {
//   const START_ID = 0;

//   // const paymentData = [];
//   const datas = require("./my-data.json");
//   for (let i = START_ID; i < START_ID + paymentData.length; i++) {
//     const data = datas[i];
//     paymentData.push({
//       ...data,
//       id: i,
//     });
//   }

//   const createdPayments = await prisma.payment.createMany({
//     data: paymentData,
//   });

//   console.log(`Created ${createdPayments.count} payments`);
// }

// main()
//   .catch((e) => {
//     console.error(e.message);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


const xlsx = require('xlsx');
const fs = require('fs');
const chokidar = require('chokidar');

async function main() {
  const START_ID = 0;

  const fileBuffer = fs.readFileSync('./prisma/my-data.xlsx');
  const myData = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = myData.SheetNames[0];
  const sheet = myData.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  jsonData.forEach((item, index) => {
    item.id = index;
  });

  fs.writeFile('my-data.json', JSON.stringify(jsonData, null, 2), function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Файл my-data.json создан');
    }
  });


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