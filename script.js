const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://yobit.net/ru/");

    // Здесь вы должны использовать правильные селекторы, чтобы выбрать только нужные цены.
    const prices = await page.$$eval('#thc', (elements) => {
        return elements.map((element) => element.innerText);
    });

    await browser.close();

    // Отправляем цены как ответ на запрос
    res.send(prices.join('\n'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
