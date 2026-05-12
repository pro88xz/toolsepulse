import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  // Restrict to YouTube thumbnail hosts to prevent SSRF abuse
  if (
    parsedUrl.hostname !== "img.youtube.com" &&
    parsedUrl.hostname !== "i.ytimg.com"
  ) {
    return NextResponse.json(
      { error: "Only YouTube thumbnail URLs are allowed" },
      { status: 403 }
    );
  }

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Thumbnail not found" },
        { status: upstream.status }
      );
    }
    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
