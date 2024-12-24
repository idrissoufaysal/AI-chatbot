import puppeteer from 'puppeteer';

export async function scrapWebsite(url: string) {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const content = await page.evaluate(() => document.body.innerText);

    await browser.close();
    return content;
  } catch (error) {
    await browser.close();
    console.error('Erreur lors du scraping:', error);
    throw error;
  }
}
