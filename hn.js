const puppeteer = require("puppeteer");

async function run(){
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    //navigate to page 
    await page.goto("https://google.com");
    // extract image from web page 
    const image = await page.$$eval("img",(elements) =>
        elements.map((elements) =>({
            src: elements.src,
            alt: elements.alt,
        }))
    );

    // extract link
    const links = await page.$$eval("a",(elements) =>
        elements.map((elements) => ({
        href: elements.href,
        text: elements.textContent,
    }))
    );
    const imageCount = image.lenght;
    const linksCount = links.lenght;

    // output of the above
    const output = JSON.stringify({image, links, imageCount, linksCount});
     console.log(output);

    // close the browser
    await browser.close();
}

run();