const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const port = 8080

const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
    // page.pdf() is currently supported only in headless mode.
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
    const pdf = await page.pdf({
      format: 'letter'
    });
    await browser.close();

    res.send(pdf)

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
