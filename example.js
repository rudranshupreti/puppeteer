const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the blog page
  await page.goto('https://www.legalkart.com/legal-blog', {
    waitUntil: 'load',
    timeout: 0
  });

  // Scroll to the bottom of the page to load all blogs (if infinite scroll is used)
  await autoScroll(page);

  // Extract blog data
  const blogs = await page.evaluate(() => {
    const blogElements = document.querySelectorAll('.container .blog-card');
    
    if (blogElements.length === 0) {
      console.log('No blog elements found with the provided selector.');
    }
    
    let blogData = [];

    blogElements.forEach(blog => {
      const title = blog.querySelector('.blog-title')?.innerText || 'No title';
      const url = blog.querySelector('a')?.href || 'No URL';
      const summary = blog.querySelector('.blog-summary')?.innerText || 'No summary';
      const time = blog.querySelector('.blog-time')?.innerText || 'No time';
      const topic = blog.querySelector('.blog-topic')?.innerText || 'No topic';
      
      blogData.push({ title, url, summary, time, topic });
    });

    return blogData;
  });

  console.log(o blogs);

  // Close the browser
  await browser.close();

  // Function to auto-scroll to the bottom of the page
  async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
})();
