const puppeteer = require('puppeteer-core');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1280, height: 850, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots_p10');

  // Accept window confirm dialog automatically
  page.on('dialog', async dialog => {
    console.log('Dialog opened:', dialog.message());
    await dialog.accept();
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Check login
  const loginInput = await page.$('input[type="email"]');
  if (loginInput) {
    await page.type('input[type="email"]', 'fenilpatel@gmail.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Find a delete button and click it
  const deleteBtn = await page.$('.delete-btn');
  if (deleteBtn) {
    console.log('Clicking delete button...');
    await deleteBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  await page.screenshot({ path: path.join(outDir, 'fig9_ui_task_deleted_dashboard.png'), fullPage: false });
  await browser.close();
  console.log('✓ fig9_ui_task_deleted_dashboard.png captured successfully');
}

run().catch(console.error);
