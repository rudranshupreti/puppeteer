const puppeteer = require('puppeteer');

async function autoScroll(page) {
  await page.evaluate(async () => {
    const container = document.querySelector('.blog-container'); // Check this selector
    let previousHeight = container.scrollHeight;
    let reachedEnd = false;

    while (!reachedEnd) {
      container.scrollBy(0, container.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Increase wait time for loading
      let newHeight = container.scrollHeight;

      if (newHeight === previousHeight) {
        reachedEnd = true;
      }
      previousHeight = newHeight;
    }
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the blog page
  await page.goto('https://www.legalkart.com/legal-blog', { waitUntil: 'networkidle2' });

  // Wait for the blog container to load
  await page.waitForSelector('.blog-container'); // Adjust the selector to match the container

  // Scroll through the page to load all the content
  await autoScroll(page);

  // Wait again in case content is still loading
  await page.waitForTimeout(2000);

  // Extract data from the page
  const blogData = await page.evaluate(() => {
    const blogs = document.querySelectorAll('.blog-container .blog-post'); // Adjust this selector

    let data = [];

    blogs.forEach(blog => {
      const title = blog.querySelector('.blog-title')?.innerText || 'No title';
      const date = blog.querySelector('.blog-date')?.innerText || 'No date';
      const views = blog.querySelector('.blog-views')?.innerText || 'No views';
      const topic = blog.querySelector('.blog-topic')?.innerText || 'No topic';

      data.push({ title, date, views, topic });
    });

    return data;
  });

  console.log(blogData); // Output data for verification

  await browser.close();
})();

