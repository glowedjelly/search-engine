const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const START_URL = 'https://en.wikipedia.org/wiki/Web_scraping';
const BASE_URL = 'https://en.wikipedia.org';
const MAX_PAGES = 100;

const visited = new Set();
const queue = [START_URL];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  await Item.deleteMany({});
  console.log('Existing items deleted.');
  await crawlQueue();
}).catch(err => {
  console.error('MongoDB connection failed:', err);
});

async function crawlQueue() {
  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

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
      console.log(`✅ Crawled: ${url}`);

      // Add internal links to queue
      $('a[href^="/wiki/"]').each((_, el) => {
        const relative = $(el).attr('href');
        const full = BASE_URL + relative.split('#')[0]; // remove anchors
        if (!visited.has(full) && !queue.includes(full)) {
          queue.push(full);
        }
      });

    } catch (err) {
      console.error(`❌ Error crawling ${url}:`, err.message);
    }
  }

  mongoose.connection.close(() => {
    console.log('✅ All done. MongoDB connection closed.');
    process.exit(0);
  });
}
