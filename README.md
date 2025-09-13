# Search Engine

A simple web crawler and search engine built with Node.js. This project demonstrates basic crawling, indexing, and searching capabilities using a custom backend and a minimal frontend.

## Features
- Crawl web pages and extract content
- Store crawled data in a simple data model
- Search indexed content via a web interface
- Minimal UI using EJS templates

## Project Structure
```
crawler.js         # Web crawler logic
server.js          # Express server and search API
models/Item.js     # Data model for indexed items
views/index.ejs    # Frontend UI (EJS template)
package.json       # Project dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (Node package manager)

### Installation
1. Clone the repository:
	```bash
	git clone https://github.com/glowedjelly/search-engine.git
	cd search-engine
	```
2. Install dependencies:
	```bash
	npm install
	```

### Usage
1. Start the server:
	```bash
	node server.js
	```
2. Open your browser and navigate to `http://localhost:3000` to use the search interface.

### Crawling
- The crawler can be run via `crawler.js` to index new pages. Adjust the script as needed for your target URLs.

## Customization
- Modify `models/Item.js` to change the data schema.
- Update `views/index.ejs` for UI changes.
- Extend `crawler.js` to support more advanced crawling features.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Author
- [glowedjelly](https://github.com/glowedjelly)