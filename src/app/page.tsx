"use client";
import { NextFastTable, Fields } from "../../package/src/index";
import { onCreate, onDelete, onFetch, onUpdate } from "@/actions/payment";


export default function DemoPageMyData() {
  const field = Fields;

  const columns = [
    field.number("id"),
    field.string("userNumber"),
    field.string("userYear"),
    field.string("userCity"),
    field.string("userName"),
  ];


  return (
    <div className=" w-full  h-screen">
      <NextFastTable
        columns={columns}
        onFetch={onFetch}
        onDelete={onDelete}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </div>
  );
}
