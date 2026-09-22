import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/news?category=forex&token=${process.env.FINNHUB_API_KEY}`);
    const responseData = await res.json();

    const itemsList = Array.isArray(responseData) ? responseData : [];

    const items = itemsList.slice(0, 20).map((item: any) => ({
      title: item.headline || "No Title",
      link: item.url || "#",
      pubDate: item.datetime ? new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      description: item.summary || "",
      isUSD: (item.headline || "").toLowerCase().includes("usd") || (item.headline || "").toLowerCase().includes("dollar") || (item.headline || "").toLowerCase().includes("fed"),
      impact: (item.headline || "").toLowerCase().includes("rate") || (item.headline || "").toLowerCase().includes("cpi") ? "HIGH" : "MEDIUM",
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("USD news fetch error:", error);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}