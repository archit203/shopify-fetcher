const express = require('express');
const cors = require('cors');
const { fetchUrls, extractUrls, scrapped_urls, getgroqresponse, prepareObject } = require('./utils/util');

const app = express();

app.use(express.json());
app.use(cors());
app.post('/fetch_result',async (req,res) => {

    const {url} = req.body;

    try{

        const urls = await fetchUrls(url);
        const extractedUrls = extractUrls(JSON.parse(urls));
        const dataScrapped = await scrapped_urls(extractedUrls);
        const groqResponse = await getgroqresponse(dataScrapped);
        const finalObject = prepareObject(extractedUrls, groqResponse);
        res.json({cardData: finalObject}).status(200);

    }catch(error){
        console.log(error);
        res.json({error: 'An error occurred'}).status(500);
    }
    
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})