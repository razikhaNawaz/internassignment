import React, { useState } from "react";

const App = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // const handleQueryChange = (event) => {
  //   setQuery(event.target.value);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Step 1: Use the Custom Search API to get the top 5 URLs related to the query
      const customSearchApiKey = "AIzaSyDwstQinDvpImf9_Qpz38cnWixainTNCUI";
      const customSearchApiUrl = `https://www.googleapis.com/customsearch/v1?key=${customSearchApiKey}&cx=a3b862a34915047c8&q=${query}`;

      const response = await fetch(customSearchApiUrl);
      const data = await response.json();
      const top5Urls = data.items.map((item) => item.link);

      // Step 2: Use ScrapingBee API to scrape text content from the URLs
      const scrapingBeeApiKey = "54HRXRRKBO3ZNKF494363FNGO2CV68J311PGXSJ2MFM916VF7NYLAL3V2DX1K2NPAPP1439BE9C9XT06";
      const scrapingBeeApiUrl = "https://api.scrapingbee.com/";

      const scrapingPromises = top5Urls.map(async (url) => {
        const response = await fetch(`${scrapingBeeApiUrl}?api_key=${scrapingBeeApiKey}&url=${url}&render_js=true`);
        const data = await response.json();
        return data.text;
      });

      const scrapedTexts = await Promise.all(scrapingPromises);

      // Step 3: Set the search results in state
      setSearchResults(scrapedTexts);
    } catch (error) {
      console.error("Error occurred during API calls:", error);
    }
  };

  return (
    <div>
      {/* <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleQueryChange} />
        <button type="submit">Search</button>
      </form> */}
      {searchResults.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </div>
  );
};

export default App;
