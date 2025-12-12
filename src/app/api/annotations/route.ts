import { NextResponse } from "next/server";
import { createAnnotationEntry } from "../_data/mockData";

export async function POST(request: Request) {
  const body = await request.json();
  const { dataset_id, timestamp, text } = body ?? {};

  if (!dataset_id || !timestamp || !text) {
    return NextResponse.json(
      { message: "dataset_id, timestamp, and text are required" },
      { status: 400 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  const annotation = createAnnotationEntry({
    dataset_id,
    timestamp: Number(timestamp),
    text,
  });

  return NextResponse.json(annotation, { status: 201 });
}


