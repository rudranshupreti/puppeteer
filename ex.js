const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the page
    await page.goto('https://lawrato.com/advocate-anuj-sawhney', { waitUntil: 'domcontentloaded' });

    // Step 1: Fill out the form
    // Example values for fields, adjust selectors and values as needed
    await page.type('input[name="name"]', 'John Doe');
    await page.type('input[name="email"]', 'john.doe@example.com');
    await page.type('textarea[name="message"]', 'I would like to get more information about your services.');

    // Step 2: Select all radio buttons
    // Assuming radio buttons have a common class or name attribute, adjust selectors as needed
    const radioButtons = await page.$$('input[type="radio"]'); // Select all radio buttons
    for (const radioButton of radioButtons) {
        // Click each radio button
        await radioButton.click();
    }

    // Click the submit button
    await page.click('button[type="submit"]'); // Adjust selector if needed
    
    // Wait for the form to be processed and the response to be displayed
    await page.waitForTimeout(5000); // Wait for 5 seconds for the response to be processed
    
    // Step 3: Extract the phone number from the page
    const phoneNumber = await page.evaluate(() => {
        // Adjust the selector to match where the phone number is displayed
        const phoneElement = document.querySelector('.phone-number'); // Example selector
        return phoneElement ? phoneElement.textContent.trim() : 'Phone number not found';
    });
    
    console.log(`Extracted phone number: ${phoneNumber}`);
    
    await browser.close();
})();
