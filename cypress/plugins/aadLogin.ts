const puppeteer = require('puppeteer-core');
const dns = require('node:dns');

interface Options {
  username?: string;
  password?: string;
  appUrl?: string;
}

let debuggingPort = ''; // Declare debuggingPort here
module.exports = {
  debuggingPort: '',
  setDebuggingPortMyService(port: [any, string]) {
    [, debuggingPort] = port;
    return null;
  },
  async aadLogin(options: Options = {}) {
    dns.setDefaultResultOrder('ipv4first');
    const username = options.username;
    const password = options.password;
    const appUrl = options.appUrl;
    const emailSelector = "[name='loginfmt']";
    const passwordSelector = '[name=passwd]';
    const submitButtonSelector = 'input[type=submit]';
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${debuggingPort}`,
      setTimeout: 30000,
    });
    const page = await browser.newPage();
    await page.goto(appUrl);
    await page.waitForNavigation();
    if (page.url().startsWith(appUrl)) {
      page.close();
      return {};
    }
    await page.waitForSelector(emailSelector);
    await page.type(emailSelector, username);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
    await page.waitForSelector(passwordSelector);
    await page.focus(passwordSelector);
    await new Promise(r => setTimeout(r, 2000));
    await page.type(passwordSelector, password);
    await page.click(submitButtonSelector);
    await page.waitForNavigation({ timeout: 0 });
    await page.waitForSelector(submitButtonSelector, { timeout: 300000 });
    await page.evaluate(() => {
      (document.querySelector('input[type=submit]') as HTMLElement)?.click();
    });
    await page.waitForNavigation({ timeout: 300000 });
    const element = await Promise.race([
      new Promise<void>(resolve => setTimeout(() => resolve(), 200)),
      page.waitForSelector('input[type=submit]', { visible: true }, { timeout: 300000 }),
    ]);
    if (element) {
      await page.click(submitButtonSelector);
    }
    await new Promise(r => setTimeout(r, 2000));
    await page.close();
    return {};
  },
};
