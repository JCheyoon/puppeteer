
import puppeteer from 'puppeteer';


(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  // Create a new page
  const page = await browser.newPage();
  await page.goto('https://sooperang.or.kr/main.do', {
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

// 예약가능 체크용, 예약가능한 스트링이 진짜 '예약가능'이여야만 함..확인할 것
  const isReservable = await page.evaluate(() => {
    const liElement = document.querySelector('li .pop_in2_inner1.sb4');
    if (liElement) {
      const spanText = liElement.querySelector('span')?.textContent;
      return spanText?.includes('예약가능') || false;
    }
    return false;
  });


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

  //check reservation
  if (isReservable) {
    console.log('예약가능');
  } else {
    console.log('예약불가');

  }
  //Close browser
  await browser.close();
})();