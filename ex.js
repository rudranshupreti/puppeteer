const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

// Function to scroll the blogging area container
async function scrollBlogContainer(page, containerSelector) {
    let previousHeight = 0;

    while (true) {
        // Scroll down to the bottom of the container
        await page.evaluate((selector) => {
            const container = document.querySelector(selector);
            if (container) {
                container.scrollBy(0, container.scrollHeight); // Scroll down
            }
        }, containerSelector);

        // Wait for 2 seconds to load new content (replace waitForTimeout with setTimeout)
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

        // Check the new height after scrolling
        const newHeight = await page.evaluate((selector) => {
            const container = document.querySelector(selector);
            return container ? container.scrollHeight : 0;
        }, containerSelector);

        // Stop scrolling when no new content is loaded
        if (newHeight === previousHeight) {
            break;
        }
        previousHeight = newHeight;
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.legalkart.com/legal-blog', { waitUntil: 'networkidle2' });

    // Selector for the scrolling container (blogging area)
    const blogContainerSelector = '.
    main-content.container'; // Update this if necessary

    // Scroll through the blog container
    await scrollBlogContainer(page, blogContainerSelector);

    // Scrape the blog data
    const blogs = await page.evaluate(() => {
        let blogData = [];

        // Select all blog elements in the blogging area
        let blogElements = document.querySelectorAll(' .post-card'); // Update if necessary

        blogElements.forEach(blog => {
            let title = blog.querySelector('.post-card-badge')?.innerText || 'No title';
            let topic = blog.querySelector('.header-post-card')?.innerText || 'No topic';
            let time = blog.querySelector('.profile-date-time')?.innerText || 'No date';
            let link = blog.querySelector('.post-card-image-link')?.href || 'No link';
            let views = blog.querySelector('.post-views')?.innerText || 'No views'; // Adjust if needed
            
            blogData.push({
                title,
                topic,
                time,
                link,
                views,
            });
        });

        return blogData;
    });

    // // Create and save Excel file
    // const worksheet = xlsx.utils.json_to_sheet(blogs);
    // const workbook = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(workbook, worksheet, "Blogs");
    // xlsx.writeFile(workbook, 'legalkart_blogs_data.xlsx');

    console.log(blogs);

    await browser.close();
})();
