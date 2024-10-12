"use client";
import { NextFastTable, Fields } from "../../package/src/index";
import { onCreate, onDelete, onFetch, onUpdate } from "@/actions/payment";


export default function DemoPageMyData() {
  const field = Fields;

  const columns = [
    // field.number("id"),
    field.string("userNumber", {label: "Номер документа"}),
    field.string("userYear", {label: "Год"}),
    field.string("userCity", {label: "Город"}),
    field.string("userName", {label: "Фамилия, имя"}),
    field.link("userLink", {label: "Ссылка"}),
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
