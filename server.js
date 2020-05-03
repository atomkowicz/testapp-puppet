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
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('http://www.example.com/', {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        const pdf = await page.pdf({
            format: 'A4',
            displayHeaderFooter: true
        });
        await browser.close();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=file.pdf',
            'Content-Length': pdf.length,
        });
        res.end(pdf);
    } catch (err) {
        res.status(500).send('Unable to print pdf file');
    }

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))