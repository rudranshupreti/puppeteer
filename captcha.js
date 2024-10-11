const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the page with CAPTCHA
  await page.goto('https://example.com');

  // Take screenshot of CAPTCHA (optional for some cases)
  const captchaImage = await page.screenshot({ path: 'captcha.png' });

  // Send image or site key to the CAPTCHA solving service
  const apiKey = 'your-2captcha-api-key';
  const siteKey = 'site-captcha-key'; // Find the site key from the HTML source code
  const pageUrl = page.url();

  // Send CAPTCHA request to 2Captcha
  const response = await axios.post(
    `http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}`
  );

  const captchaId = response.data.split('|')[1];

  // Wait for CAPTCHA to be solved
  const captchaResponse = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`);

  let solvedCaptcha;
  while (solvedCaptcha === 'CAPCHA_NOT_READY') {
    await new Promise((r) => setTimeout(r, 5000));
    const resp = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`);
    solvedCaptcha = resp.data;
  }

  // Once solved, fill in the response
  await page.evaluate((token) => {
    document.querySelector('textarea#g-recaptcha-response').innerHTML = token;
  }, solvedCaptcha.split('|')[1]);
  // Submit form or trigger CAPTCHA check
  await page.click('#submit-btn');

  // Perform further actions...
})();


  m