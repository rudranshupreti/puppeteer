const puppeteer = require('puppeteer');
const fs = require('fs');  // For saving the link to a file

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // Set to false to observe browser actions
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Replace with your actual Quora account credentials
  const accounts = [
    { email: 'rudranshupreti17@gmail.com', password: 'Bhavyasood' }
    // Add more accounts if needed
  ];

  // Function to log into Quora and ask a question
  async function loginAndAskQuestion(page, email, password, questionText) {
    await page.goto('https://www.quora.com/', { waitUntil: 'networkidle2' });

    // Wait for the email and password input fields and type in credentials
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', email, { delay: 100 });

    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', password, { delay: 100 });

    // Use your selector for the login button
    const loginButtonSelector = '#root > div > div.q-box > div > div > div > div > div > div.q-flex.qu-mb--large > div:nth-child(2) > div:nth-child(4) > button';
    await page.waitForSelector(loginButtonSelector);  // Wait for the login button
    await page.click(loginButtonSelector);            // Click the login button
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

    // Wait for login to complete
    await page.waitForTimeout(5000);

    // Navigate to the 'Ask Question' page
    await page.goto('https://www.quora.com/q/ask', { waitUntil: 'networkidle2' });

    // Wait for the 'Ask Question' input field
    const askQuestionSelector = 'textarea[placeholder="Start your question with ' + '"What", "How", "Why", etc."]';
    await page.waitForSelector(askQuestionSelector);

    // Type the question
    await page.type(askQuestionSelector, questionText, { delay: 100 });

    // Submit the question
    const submitButtonSelector = 'button[type="submit"]';  // Adjust if needed based on your inspection
    await page.waitForSelector(submitButtonSelector);
    await page.click(submitButtonSelector);

    // Wait for the question submission process to complete
    await page.waitForTimeout(5000);

    // After submission, capture the URL of the newly created question page
    const questionURL = page.url();

    // Save the link to a file
    const linkData = `Question asked by ${email}: ${questionURL}\n`;
    fs.appendFileSync('quora_question_links.txt', linkData);

    console.log(`Asked question: ${questionText} on Quora with email: ${email}`);
    console.log(`Question link saved: ${questionURL}`);
  }

  // Example question to ask
  const questionToAsk = 'What are the best practices for automating tasks using Puppeteer?';

  // Log into Quora and ask a question for each account
  for (let i = 0; i < accounts.length; i++) {
    const page = await browser.newPage();  // Open a new tab for each account
    const { email, password } = accounts[i];

    try {
      await loginAndAskQuestion(page, email, password, questionToAsk);  // Log in and ask the question
    } catch (error) {
      console.error(`Failed to log in and ask a question for account: ${email}`, error);
    }
  }

  // Keep the browser open after logging in
})();
