const puppeteer = require("puppeteer");


async function run(){
  // to launch the browser intance 

  const browser = await puppeteer.launch ({headless:false});// always us await function with puppeteer because we have wait before run this 
  const page = await browser.newPage();
  await page.goto("https://yahoo.com");
  const title = await page.title();// to bring out the title of the web page 
  console.log(title);
  const heading = await page.$eval('p',(element) => element.TextContent);// $eval if it funtion to evaluat the web page and do some task 
  await page.pdf({path:'google1.pdf',format:'A4'}); //use to get pdf 
  await browser.close();

     

}
run();
  
