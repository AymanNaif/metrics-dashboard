import { NextResponse } from "next/server";
import { generateMetrics } from "../_data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dataset = searchParams.get("dataset");
  const from = Number(searchParams.get("from"));
  const to = Number(searchParams.get("to"));
  const fieldsParam = searchParams.get("fields") ?? "";
  const fields = fieldsParam.split(",").filter(Boolean);

  if (!dataset || Number.isNaN(from) || Number.isNaN(to) || fields.length === 0) {
    return NextResponse.json(
      { message: "dataset, from, to, and fields are required" },
      { status: 400 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 450));

  const data = generateMetrics(dataset, from, to, fields);
  return NextResponse.json(data);
}


