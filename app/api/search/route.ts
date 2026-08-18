import { NextResponse } from "next/server";
import { searchDestinations } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (!query) {
    return NextResponse.json({ countries: [], cities: [] });
  }

  if (query.length > 100) {
    return NextResponse.json({ error: "Busca muito longa." }, { status: 400 });
  }

  try {
    const results = await searchDestinations(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível realizar a busca." },
      { status: 500 },
    );
  }
}
