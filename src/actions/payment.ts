"use server";
import { Payment } from "@prisma/client";
import prisma from "@/lib/db";
import {
  FetchParams,
  CreateParams,
  DeleteParams,
  UpdateParams,
} from "../../package/src/index";
import path from "path";



function isDate(obj: any) {
  return obj instanceof Date && !isNaN(obj as any);
}

// export async function onFetch(obj: FetchParams) {
//   console.log("🚀 ~ onFetch ~ obj:", obj)
//   const pageSize = obj.pagination?.pageSize ?? 10;
//   const pageIndex = obj.pagination?.pageIndex ?? 0;

//   const sorting =
//     obj.sorting?.map((sort) => {
//       return { [sort.id]: sort.desc ? "desc" : "asc" };
//     }) || [];

//   const filters =
//     obj.columnFilters?.map((filter) => {
//       if (
//         typeof filter.value === "number" ||
//         typeof filter.value === "boolean"
//       ) {
//         return {
//           [filter.id]: {
//             equals: filter.value,
//           },
//         };
//       } else if (typeof filter.value === "string") {
//         return { [filter.id]: { contains: filter.value } };
//       } else if (isDate(filter.value)) {
//         return {
//           [filter.id]: {
//             gte: filter.value,
//           },
//         };
//       }
//     }) || [];

//   const total = await prisma.payment.count({
//     where: {
//       AND: filters as any,
//     },
//   });

//   const payments = await prisma.payment.findMany({
//     take: pageSize,
//     skip: pageIndex * pageSize,
//     orderBy: sorting.length > 0 ? sorting : [{ id: "desc" }],
//     where: {
//       AND: filters as any,
//     },
//   });

//   return {
//     list: payments,
//     total,
//   };
// }

export const readCsv = async (filePath: string) => {
  const Papa = require("papaparse");
const fs = require("fs")

  try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const results = Papa.parse(data, {
          header: true,
      });
      return results.data;
  } catch (error) {
      console.error("Error reading CSV file in readCsv file utils-read-data-pp:", error);
      throw error;
  }
};

export async function onFetch(obj: FetchParams) {
  const filePath = path.join(process.cwd(), '/prisma', 'test-csv-full-2.csv');
  const personsData = await readCsv(filePath);
  console.log("🚀 ~ onFetch ~ personsData:", personsData)
  const pageSize = obj.pagination?.pageSize ?? 10;
  const pageIndex = obj.pagination?.pageIndex ?? 0;

  // Simulated sorting
  const sortedPayments = personsData.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      if (!obj.sorting || obj.sorting.length === 0) return 0;
      const sort = obj.sorting[0];
      const multiplier = sort.desc ? -1 : 1;
      if (a[sort.id] < b[sort.id]) return -1 * multiplier;
      if (a[sort.id] > b[sort.id]) return 1 * multiplier;
      return 0;
  });


  const filteredPayments = sortedPayments.filter((person) => {
      if (!obj.columnFilters || obj.columnFilters.length === 0) return true;
      return obj.columnFilters.every((filter) => {
          if (
              typeof filter.value === "boolean"
          ) {
              return person[filter.id] === filter.value;
          } else if (typeof filter.value === "string") {
              if (filter.exactMatch) {
                  return person[filter.id] === filter.value;
              } else {
                  return person[filter.id].toLowerCase().includes(filter.value.toLowerCase());
              }
          }
          return false;
      });
  });

  const total = filteredPayments.length;
  const list = filteredPayments.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
  );

  return {
      list,
      total,
  };
}


export async function onCreate(data: CreateParams<Payment>) {
  await prisma.payment.create({
    data: data as any,
  });
}

export async function onDelete(data: DeleteParams<number>) {
  await prisma.payment.deleteMany({
    where: {
      id: {
        in: [data].flat().map((d) => d.id),
      },
    },
  });
}

export async function onUpdate(data: UpdateParams<Payment>) {
  await prisma.payment.update({
    where: {
      id: data.id,
    },
    data: data as any,
  });
}
