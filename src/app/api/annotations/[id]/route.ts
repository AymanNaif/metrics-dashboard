import { NextResponse } from "next/server";
import { deleteAnnotationEntry } from "../../_data/mockData";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  deleteAnnotationEntry(id);
  return NextResponse.json({ ok: true });
}


