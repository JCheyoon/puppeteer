
import puppeteer from 'puppeteer';
import 'dotenv/config'


(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  // Create a new page
  const page = await browser.newPage();
  await page.goto(process.env.SITE_URL ?? '', {
    waitUntil: 'load',
    // Remove the timeout
    timeout: 0
  });

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  //login

  //reservation: 원하는 날짜 바꾸려면 data-title 값을 바꿔야한다
  const dayFrom = 'td.weekend.available span[data-title="r1c6"]';
  const dayTo = 'td.weekend.available span[data-title="r2c0"]';
  const chooseLocationBtn = 'button#selectInstt';
  const location = 'li.qrInsttClass#qrInstt_FT00001';
  const product = 'button#selectProduct';
  const search = 'button.btn[onclick*="fn_formSubmit()"]';


  await page.waitForSelector(dayFrom);
  await page.click(dayFrom);
  await page.waitForSelector(dayTo);
  await page.click(dayTo);
  await page.waitForSelector(chooseLocationBtn);
  await page.click(chooseLocationBtn);
  await page.waitForSelector(location);
  await page.click(location)
  await page.waitForSelector(product);
  await page.click(product)

  // Wait for the dropdown menu to appear
  await page.waitForSelector('.dropdown-menu');
  // Click on the specific menu item "일반예약(숙박예약)"
  await page.click('li[onclick^="fn_selectProduct(1,"]');
  await page.waitForSelector(search);
  await page.click(search)
  await page.waitForNavigation({ waitUntil: 'load' });
  //check reservation
  const isReservable = await page.$eval(
  '#divCnt1 > div.popup.sb4 > div > div.pop_in2.sb4 > ul > li:nth-child(1)', element => {
    return element.textContent?.trim().toLowerCase() === '예약불가';
  });

  if (isReservable) {
    console.log('예약불가');
  } else {
    console.log('예약가능');
  }
  //Close browser
  await browser.close();
})();

