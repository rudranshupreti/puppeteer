const fs = require("fs");
const puppeteer = require("puppeteer");

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null, // Ensure proper viewport size
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.in/s?i=shoes&bbn=100637043031&rh=n%3A1983572031%2Cp_n_pct-off-with-tax%3A2665402031&dc&hidden-keywords=-Sponsored&ds=v1%3AUjFt3k8pHqsROqUYKQnCTPn58t5yp6s0Y0OJCgsVqbI&_encoding=UTF8&content-id=amzn1.sym.23229f90-d29c-4c68-87b9-f58e9f23b1c7&pd_rd_r=a20a3906-7cf1-44ba-831a-7a296f22f203&pd_rd_w=8WoCM&pd_rd_wg=DbFJN&pf_rd_p=23229f90-d29c-4c68-87b9-f58e9f23b1c7&pf_rd_r=RWPPHJPDR484Z904E3F3&qid=1724997416&rnid=2665398031&ref=pd_hp_d_hero_unk"
  );

  let isBtnDisabled = false;
  while (!isBtnDisabled) {
    await page.waitForSelector('[data-cel-widget="search_result_0"]');
    const productsHandles = await page.$$(
      ".s-main-slot .s-result-item"
    );

    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";
      let img = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector("h2 > a > span").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) => el.querySelector(".a-price .a-offscreen").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        img = await page.evaluate(
          (el) => el.querySelector(".s-image").getAttribute("src"),
          producthandle
        );
      } catch (error) {}

      if (title !== "Null") {
        fs.appendFile(
          "amazon.csv",
          `${title.replace(/,/g, ".")},${price},${img}\n`,
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    // Check if the "Next" button is disabled
    const nextButton = await page.$(".s-pagination-next");
    if (nextButton) {
      isBtnDisabled = await nextButton.evaluate((el) =>
        el.getAttribute("aria-disabled") === "true"
      );
    } else {
      isBtnDisabled = true;
    }

    if (!isBtnDisabled) {
      await Promise.all([
        nextButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
    }
  }

  await browser.close();
})();
