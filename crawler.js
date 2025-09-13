const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const visited = new Set();
const MAX_PAGES = 100;
let pageCount = 0;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  await Item.deleteMany({});
  console.log('Existing items deleted.');
  await crawlSite('https://en.wikipedia.org/wiki/Web_scraping');
}).catch(err => {
  console.error('MongoDB connection failed:', err);
});

async function crawlSite(url) {
  if (visited.has(url) || pageCount >= MAX_PAGES) return;
  visited.add(url);
  pageCount++;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const insertPromises = [];

    $('h2, h3, p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) {
        insertPromises.push(
          Item.findOneAndUpdate(
            { url },
            { name: text.slice(0, 30), description: text, url },
            { upsert: true, new: true }
          )
        );
      }
    });

    await Promise.all(insertPromises);
    console.log(`Crawled: ${url}`);

    // Find and crawl internal links
    $('a[href^="/wiki/"]').each((_, el) => {
      const relativeLink = $(el).attr('href');
      const fullLink = `https://en.wikipedia.org${relativeLink}`;
      crawlSite(fullLink); // fire and forget
    });

  } catch (err) {
    console.error(`Error crawling ${url}:`, err.message);
  }

  if (pageCount >= MAX_PAGES) {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed. Exiting...');
      process.exit(0);
    });
  }
}
