// app/api/economic-calendar/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Har 1 ghante (3600 seconds) me automatic server-side refresh

export async function GET() {
  try {
    const res = await fetch('https://www.forexfactory.com/ff_calendar_thisweek.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Forex Factory calendar');
    }

    const xmlText = await res.text();

    // XML parsing using Regex
    const events: any[] = [];
    const eventRegex = /<event>([\s\S]*?)<\/event>/g;
    let match;

    while ((match = eventRegex.exec(xmlText)) !== null) {
      const eventBlock = match[1];
      const getTagValue = (tag: string) => {
        const tagRegex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'i');
        const tagMatch = tagRegex.exec(eventBlock);
        return tagMatch ? tagMatch[1].trim() : '';
      };

      const country = getTagValue('country');
      const impact = getTagValue('impact');

      events.push({
        id: Math.random().toString(36).substring(2, 9),
        title: getTagValue('title'),
        country: country || 'USD',
        date: getTagValue('date'),
        time: getTagValue('time'),
        impact: impact || 'Low', // High, Medium, Low
        forecast: getTagValue('forecast') || '-',
        previous: getTagValue('previous') || '-',
        actual: getTagValue('actual') || '-',
      });
    }

    return NextResponse.json({ status: 'ok', data: events });
  } catch (error) {
    console.error('Calendar Fetch Error:', error);
    
    // Fallback Mock Data agar Forex Factory rate limit kare
    const fallbackEvents = [
      { id: '1', title: 'Core CPI m/m', country: 'USD', date: '09-21-2026', time: '8:30am', impact: 'High', forecast: '0.3%', previous: '0.2%', actual: '0.3%' },
      { id: '2', title: 'FOMC Press Conference', country: 'USD', date: '09-21-2026', time: '2:00pm', impact: 'High', forecast: '-', previous: '-', actual: '-' },
      { id: '3', title: 'Unemployment Claims', country: 'USD', date: '09-22-2026', time: '8:30am', impact: 'High', forecast: '220K', previous: '222K', actual: '-' },
      { id: '4', title: 'Flash Manufacturing PMI', country: 'EUR', date: '09-22-2026', time: '4:00am', impact: 'Medium', forecast: '45.8', previous: '45.6', actual: '-' },
      { id: '5', title: 'Retail Sales m/m', country: 'GBP', date: '09-23-2026', time: '2:00am', impact: 'Medium', forecast: '0.4%', previous: '0.5%', actual: '-' },
    ];

    return NextResponse.json({ status: 'fallback', data: fallbackEvents });
  }
}