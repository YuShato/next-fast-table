"use server";
import { Payment } from "@prisma/client";
import prisma from "@/lib/db";
import {
  FetchParams,
  CreateParams,
  DeleteParams,
  UpdateParams,
} from "../../package/src/index";

function isDate(obj: any) {
  return obj instanceof Date && !isNaN(obj as any);
}

export async function onFetch(obj: FetchParams) {
  const pageSize = obj.pagination?.pageSize ?? 20;
  const pageIndex = obj.pagination?.pageIndex ?? 0;

  const sorting =
    obj.sorting?.map((sort) => {
      return { [sort.id]: sort.desc ? "desc" : "asc" };
    }) || [];

  // новое 15.10, полностью рабочий вариант
  const filters =
  obj.columnFilters?.map((filter) => {
    if (
      typeof filter.value === "number" ||
      typeof filter.value === "boolean"
    ) {
      return {
        [filter.id]: {
          equals: filter.value,
        },
      };
    } else if (typeof filter.value === "string") {
      const transformedValue = filter.value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return {
        [filter.id]: {
          contains: `%${transformedValue}%`,
        },
      };
    } else if (isDate(filter.value)) {
      return {
        [filter.id]: {
          gte: filter.value,
        },
      };
    }
  }) || [];

  const allDataCount = await prisma.payment.count();

  const total = await prisma.payment.count({
    where: {
      AND: filters as any,
    },
  });

  const payments = await prisma.payment.findMany({
    take: pageSize,
    skip: pageIndex * pageSize,
    orderBy: sorting.length > 0 ? sorting : [{ id: "asc" }],
    where: {
      AND: filters as any,
    },
  });

  return {
    list: payments,
    total,
    allDataCount,
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
