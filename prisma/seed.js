//seed
const Papa = require("papaparse");
const fs = require("fs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const datas2 = require("./data-2.json");
// const datasCsv = require("./test-csv-full-2.csv");
// const datas = require("./data.json");

function randomStringArray(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.random().toString(36).substring(7));
  }
  return arr;
}

function randomJSON(length) {
  const obj = {};
  for (let i = 0; i < length; i++) {
    obj[Math.random().toString(36).substring(7)] = Math.random()
      .toString(36)
      .substring(7);
  }
  return obj;
}

async function main() {
  // You can change this, a seed action will create 500 payments, starting from id 0,
  // if you want to add more, just change the START_ID, example 501, 1001, etc
  const START_ID = 0;

  const paymentData = [];
  for (let i = START_ID; i < START_ID + 9; i++) {
    const data = datas2[i % 9];
    paymentData.push({
      ...data,
      id: i,
      tags: randomStringArray(5),
      extra: randomJSON(5),
    });
  }


  const createdPayments = await prisma.payment.createMany({
    data: paymentData,
  });

  console.log(`Created ${createdPayments.count} payments`);
}





main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// main()
//   .catch((e) => {
//     console.error(e.message);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
