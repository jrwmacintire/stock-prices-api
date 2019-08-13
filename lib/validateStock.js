const API_SEARCH_URL = process.env.API_SEARCH_URL; // URL for stock price info
const API_KEY = `&apikey=${process.env.API_KEY}`;

const fetch = require('node-fetch');

module.exports = async function validateStock(stock) {
  
  const fullURL = `${API_SEARCH_URL}${stock.toUpperCase()}${API_KEY}`;
    
  // console.log(`API_SEARCH_URL + stockName: '${API_SEARCH_URL}${stock.toUpperCase()}${API_KEY}'`);
  
  try {
    
    const data = await fetch(fullURL)
                            .then(response => {
                                // console.log(response);
                                return response.json();
                            })
                            .then(json => {
                                // console.log(`json:\n`, json);
                                return json;
                            })
                            .catch(err => console.error(`error fetching data!`, err));
    
    return data;
    
  } catch(err) { throw err; }
}