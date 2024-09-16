const puppeteer = require('puppeteer');
const xlsx = require("xlsx");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    let currentPage = 0;
    let hasMorePages = true;
    let allLawyers = []; // To store all the data

    while (hasMorePages) {
        try {
            const url = `https://lawrato.com/civil-lawyers?&page=${currentPage}`;
            console.log(`Navigating to: ${url}`);
            
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            // Scrape lawyer data from the page
            const lawyers = await page.evaluate(() => {
                const lawyerElements = document.querySelectorAll('.list-result .lawyer-item.border-box');
                return Array.from(lawyerElements).map(el => {
                    const name = el.querySelector('.media-heading')?.textContent.trim();
                    const location = el.querySelector('.location')?.textContent.trim();
                    const experience = el.querySelector('.experience')?.textContent.trim();
                    const imgSrc = el.querySelector('.media-object.img-responsive')?.getAttribute('src');
                    return { name, location, experience, imgSrc };
                });
            });

            console.log(lawyers); // Print the data scraped from the current page
            allLawyers = allLawyers.concat(lawyers); // Add the data to the full array

            if (lawyers.length === 0) {
                console.log("No more lawyers found on this page. Stopping.");
                hasMorePages = false; // Stop if no lawyers are found
            } else {
                currentPage++; // Increment the page number for the next loop
            }
        } catch (error) {
            console.error(`Error on page ${currentPage}: ${error.message}`);
            hasMorePages = false; // Stop on error
        }
    }

    // Save the data to an Excel file
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(allLawyers);
    xlsx.utils.book_append_sheet(wb, ws, "Lawyers");
    xlsx.writeFile(wb, 'LawyersData.xlsx');

    console.log("Scraping complete. Data saved to LawyersData.xlsx");
    await browser.close();
})();
