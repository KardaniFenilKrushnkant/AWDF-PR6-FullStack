const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1280, height: 850, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots_p10');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('1. Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Check if we need to log in
  const loginInput = await page.$('input[type="email"]');
  if (loginInput) {
    console.log('2. Logging in with test credentials...');
    await page.type('input[type="email"]', 'fenilpatel@gmail.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('3. Logged into Dashboard. Creating new task in UI...');
  // Fill task form
  await page.type('#task-title', 'Practical 10: Event-Driven Background Notifications');
  await page.type('#task-desc', 'Decoupled email notification dispatch via Node.js native EventEmitter');
  
  // Select high priority
  const highPriorityBtn = await page.$('.priority-pill:nth-child(3)');
  if (highPriorityBtn) {
    await highPriorityBtn.click();
  }

  // Submit form
  console.log('4. Submitting form to trigger POST /tasks and EventEmitter...');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1000));

  // Take Screenshot 1: Task Created with Live Event Stream & Toast
  console.log('5. Capturing Screenshot 1: Task Created UI with Event Stream...');
  await page.screenshot({ path: path.join(outDir, 'fig7_ui_task_created_dashboard.png'), fullPage: false });

  // Click Simulate Error Button
  console.log('6. Clicking Simulate Error Event button in UI...');
  const errorBtn = await page.$('.btn-simulate-error');
  if (errorBtn) {
    await errorBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Take Screenshot 2: Error Event Interception in UI
  console.log('7. Capturing Screenshot 2: Error Event UI Interception...');
  await page.screenshot({ path: path.join(outDir, 'fig8_ui_error_event_dashboard.png'), fullPage: false });

  await browser.close();
  console.log('✓ UI Screenshots successfully captured in docs/screenshots_p10/ !');
}

run().catch(console.error);
