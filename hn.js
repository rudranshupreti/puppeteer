const puppeteer = require("puppeteer");

(async () =>{
    const browser = await puppeteer.launch({headless:false});

const page = await browser.newPage();

const latitude = 37.344;
const longitude = 122.324;
await page.browserContext().overridePermissions('https;//example.com', ['geolocation']);
await page.setGeolocation({latitude,longitude});
await page.goto('https://example.com');
await  page.screenshot({path: 'geological.png'}
);
await browser.close();
})();