import { NextResponse } from "next/server";
import { listDatasets } from "../_data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "all") as
    | "active"
    | "inactive"
    | "archived"
    | "all";

  await new Promise((resolve) => setTimeout(resolve, 350));

  const datasets = listDatasets(search, status);
  return NextResponse.json({ datasets });
}


