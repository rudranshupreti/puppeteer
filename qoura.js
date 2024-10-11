const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // Set to false so you can see the browser in action
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // List of Quora account credentials
  const accounts = [
    { email: 'rudranshupreti17@gmail.com', password: 'Bhavyasood13' },
    { email: 'rudranshupreti17@gmail.com', password: 'Bhavyasood13' },
    { email: 'rudranshupreti17@gmail.com', password: 'Bhavyasood13' },
    { email: 'rudranshupreti17@gmail.com', password: 'Bhavyasood13' },
    { email: 'rudranshupreti17@gmail.com', password: 'Bhavyasood13' },


   
  ];

  // Function to log into Quora with given email and password
  async function loginToQuora(page, email, password) {
    await page.goto('https://www.quora.com/');  // Go to Quora's homepage

    // Wait for the login form fields to appear
    await page.waitForSelector('input[name="email"]');  // Wait for the email input field

    // Type the email and password into the form
    await page.type('input[name="email"]', email, { delay: 100 });   // Enter email
    await page.type('input[name="password"]', password, { delay: 100 }); // Enter password

    const loginButtonSelector = '#root > div > div.q-box > div > div > div > div > div > div.q-flex.qu-mb--large > div:nth-child(2) > div:nth-child(4) > button';
    await page.waitForSelector(loginButtonSelector);  // Wait for the button to appear
    await page.click(loginButtonSelector);            // Click the login button

    // Wait for some time to ensure login is processed
    await page.waitForTimeout(5000);  // Wait for 5 seconds after clicking

    console.log(`Logged into Quora with email: ${email}`);
  }

  // Open a new tab for each account and log in
  for (let i = 0; i < accounts.length; i++) {
    const page = await browser.newPage();  // Open a new tab for each account
    const { email, password } = accounts[i];

    try {
      await loginToQuora(page, email, password);  // Login using the credentials
    } catch (error) {
      console.error(`Failed to log into account with email: ${email}`, error);
    }
  }

  // Browser stays open indefinitely after logging in
})();
