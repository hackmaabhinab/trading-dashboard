// app/api/usd-news/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Har 1 ghante me refresh

export async function GET() {
  try {
    const res = await fetch('https://www.forexlive.com/feed/news', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('News fetch failed');

    const xmlText = await res.text();
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null && items.length < 15) {
      const block = match[1];
      const getTag = (tag: string) => {
        const m = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'is').exec(block);
        return m ? m[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
      };

      const title = getTag('title');
      const link = getTag('link');
      const pubDate = getTag('pubDate');
      const description = getTag('description').replace(/<[^>]*>?/gm, '').slice(0, 140) + '...';

      // USD currency check
      const isUSD = title.toUpperCase().includes('USD') || 
                    title.toUpperCase().includes('FED') || 
                    title.toUpperCase().includes('DOLLAR') || 
                    title.toUpperCase().includes('INFLATION') ||
                    title.toUpperCase().includes('FOMC');

      items.push({
        title,
        link,
        pubDate: pubDate ? new Date(pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        description,
        isUSD,
        impact: isUSD ? 'HIGH USD ALERT' : 'MARKET WIRE',
      });
    }

    return NextResponse.json({ status: 'ok', items });
  } catch (err) {
    return NextResponse.json({
      status: 'fallback',
      items: [
        {
          title: 'USD/JPY surge continues above 158.00 following US Treasury yield spikes',
          link: '#',
          pubDate: '10 mins ago',
          description: 'US Dollar index stays firm ahead of upcoming Fed interest rate decision and CPI print.',
          isUSD: true,
          impact: 'HIGH USD ALERT'
        },
        {
          title: 'Federal Reserve commentary suggests cautious approach on rate cuts',
          link: '#',
          pubDate: '35 mins ago',
          description: 'Fed officials emphasize data dependency before adjusting benchmark policy rates.',
          isUSD: true,
          impact: 'HIGH USD ALERT'
        }
      ]
    });
  }
}