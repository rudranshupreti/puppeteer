@ generateScreeshot
const puppeteer = require("puppeteer");
 async function generateScreeshot(url,outputPath) {


    try {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();

        await page.goto(url);
         await page.screenshot({path:outputPath});
        
         await browser.close();
         console.log('Screenshot is genrated successfully');

    }
    catch(err){
        console.log("unable to take");
    }
    
 }

 const url = "https://google.com";
 const outputPath = "google-ss.png";

 generateScreeshot(url,outputPath);
