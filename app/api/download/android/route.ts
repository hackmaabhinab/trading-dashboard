import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APK_CONTENT_TYPE = "application/vnd.android.package-archive";
const DEFAULT_APK_SOURCE_URL =
  "https://pub-0898d8bb625c43feb7ba6c33c57a9e27.r2.dev/vaultterminal/vaultterminal.apk";

export async function GET(request: NextRequest) {
  const sourceUrl = process.env.ANDROID_APK_SOURCE_URL || DEFAULT_APK_SOURCE_URL;

  let parsedSource: URL;
  try {
    parsedSource = new URL(sourceUrl);
  } catch {
    return Response.json({ error: "Android app download URL is invalid." }, { status: 503 });
  }

  if (parsedSource.protocol !== "https:") {
    return Response.json({ error: "Android app download URL must use HTTPS." }, { status: 503 });
  }

  try {
    const upstream = await fetch(parsedSource, {
      headers: request.headers.get("range")
        ? { Range: request.headers.get("range")! }
        : undefined,
      cache: "no-store",
      redirect: "follow",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return Response.json(
        { error: "The Android app file is temporarily unavailable." },
        { status: 502 },
      );
    }

    const headers = new Headers({
      "Content-Type": APK_CONTENT_TYPE,
      "Content-Disposition": 'attachment; filename="VAULT-Terminal.apk"',
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    });

    for (const name of ["content-length", "content-range", "accept-ranges"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch {
    return Response.json(
      { error: "The Android app download could not be started." },
      { status: 502 },
    );
  }
}
