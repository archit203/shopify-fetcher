const axios = require('axios');
const xmlParser = require('xml2json');
const puppeteer = require('puppeteer');
const Groq = require('groq-sdk');

require('dotenv').config();

const groq = new Groq({apiKey: process.env.GROQ_API});

async function getGroqChatCompletion(data) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${data} 
            Summarize the data in 3 to 4 lines and each line should contain 10 to 12 words.
          `,
        },
      ],
      model: "llama3-8b-8192",
    });
}

async function fetchUrls(url){

    url = url + 'sitemap.xml';
    const urlData = await axios.get(url);
    const data_url = urlData.data;
    const parsedData = xmlParser.toJson(`${data_url}`);
    const jsonData = JSON.parse(parsedData);

    const urls = await axios.get(jsonData.sitemapindex.sitemap[0].loc);
    
    const data = urls.data;

    return xmlParser.toJson(`${data}`);
}

function extractUrls(parsedData) {
    const {url} = parsedData.urlset;
    const filter_urls = url.filter(item => item['image:image'] !== undefined);
    return filter_urls;
}

async function scrapped_urls(extractedUrls){

    let scrappedData = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for(let i=0; i<5; i++){
        
        await page.goto(extractedUrls[i].loc);
        const textContent = await page.evaluate(() => {
            const body = document.querySelector('body');
            return body.innerText;
        })

        scrappedData.push(textContent);
        
    }

    await browser.close();

    return scrappedData;
}

async function getgroqresponse(dataScrapped){

    let groqResponse = [];

    for(let i=0; i<dataScrapped.length; i++){
        const response = await getGroqChatCompletion(dataScrapped[i]);
        const summary = response.choices[0]?.message?.content;
        const points = summary.split('.').filter(point => point.trim() !== '');
        groqResponse.push(points);
    }

    return groqResponse;
}

function prepareObject(extractedUrls, groqResponse){
    let finalObject = [];

    for(let i=0; i<5; i++){
        finalObject.push({
            imageUrl : extractedUrls[i]['image:image']['image:loc'],
            productTitle: extractedUrls[i]['image:image']['image:title'],
            productDescription: groqResponse[i]
        })
    }

    return finalObject;
}

module.exports = {
    fetchUrls,
    extractUrls,
    scrapped_urls,
    getgroqresponse,
    prepareObject
}