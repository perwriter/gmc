import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

const cache: { [key: string]: any } = {}; // In-memory cache

export async function POST(req: NextRequest) {
  const { gmcNumber } = await req.json();

  if (!gmcNumber) {
    return NextResponse.json({ error: 'GMC number is required' }, { status: 400 });
  }

  try {
    // Check if the data is already cached
    if (cache[gmcNumber]) {
      console.log('Cache hit for GMC number:', gmcNumber);
      return NextResponse.json(cache[gmcNumber]);
    }

    const data = await verifyGMC(gmcNumber);
    
    // Cache the result
    cache[gmcNumber] = data;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API ERROR:', error);
    return NextResponse.json({ error: error.message || 'Scraping failed' }, { status: 500 });
  }
}

async function verifyGMC(gmcNumber: string) {
  const browser = await chromium.launch({
    headless: true, // Launch in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Create a browser context with the user agent set
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    });
    
    const page = await context.newPage(); // Open a new page in the context
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(30000);

    // Use 'networkidle' instead of 'networkidle2'
    await page.goto(`https://www.gmc-uk.org/registrants/${gmcNumber}`, {
      waitUntil: 'networkidle', // Changed from 'networkidle2' to 'networkidle'
    });

    await page.waitForSelector('#registrantNameId', { timeout: 15000 });
    await page.waitForSelector('#gmcNumberId', { timeout: 15000 });

    const data = await page.evaluate(() => {
      const registrantNameId = document.querySelector('#registrantNameId')?.textContent?.trim() || '';
      const gmcNumberId = document.querySelector('#gmcNumberId')?.textContent?.trim() || '';
      return { registrantNameId, gmcNumberId };
    });

    if (!data.registrantNameId || !data.gmcNumberId) {
      throw new Error('Unable to extract name or number');
    }

    return data;
  } finally {
    await browser.close();
  }
}
