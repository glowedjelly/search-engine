const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Item = require('./models/Item');

mongoose.connect('mongodb://localhost:27017/searchDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function crawlSite(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  $('h2, h3, p').each(async (_, el) => {
    const text = $(el).text().trim();
    if (text.length > 20) {
      await Item.create({ name: text.slice(0, 30), description: text });
    }
  });

  console.log('Crawling complete.');
}

crawlSite('https://example.com');
