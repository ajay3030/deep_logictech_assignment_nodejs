const http = require("http"); // Internal Module of Node
const https = require("https"); // Internal Module of Node
const PORT =80;

//Requesting the Webpage Data
const req = https.request("https://time.com", (res) => {
  const data = []; // BufferArray Form Of Website 
  res.on("data", (_) => data.push(_));
  res.on("end", () => {
    // Clearing the Dump
    const dump_str = data.join(); // All The WebPage as String
    const dump_start = dump_str.search(
      '<h2 class="latest-stories__heading">Latest Stories</h2>'
    ); // Nearest Start of Required Data
    const dump_end = dump_str.search("homepage-section-v2 mag-subs"); //Nearest End of Required Data
    const res_str = dump_str.slice(dump_start, dump_end); // Compartively Cleaner Data

    //Refining The Required Data
    const pos_start = res_str.search("<ul>"); // Start Location of Required Data
    const pos_end = res_str.search("</ul>"); // End Location Of Required Data
    const final_data = res_str.slice(pos_start + 4, pos_end); // Retrive Final Data
    const arr = final_data.split("</li>"); // Split into Array of Indivisual Elements

    // Parsing the Required Data
    const API_DATA = [];
    //Iterate over Each Element
    arr.map((data) => {
      // Refining Links
      link_s = data.search('<a href="'); // Start Location of Link Endpoint
      link_e = data.search('/"'); // End Location Of Link Endpoint
      link_raw = data.slice(link_s + '<a href="'.length, link_e); // Article Endpoint
      url = "https://time.com" + link_raw; // Concatenate to Make URL

      //Refining Headings
      head_s = data.search('<h3 class="latest-stories__item-headline">'); // Start Location of Heading
      head_e = data.search("</h3>"); // End Location Of Heading
      heading = data.slice(
        head_s + '<h3 class="latest-stories__item-headline">'.length,
        head_e
      );// Heading of Article

      const DATA_OBJ = { title: heading, link: url }; // JSON Object of URL , Heading
      API_DATA.push(DATA_OBJ); // Push Operation on Array
    });
    // Creating Server to send Data
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(API_DATA.slice(0, 6))); //Array of JSON Objects is Sent From Here
    });
    server.listen(PORT, () => {
      console.log(`Server running at PORT: http://localhost:${PORT}/`);
    });
  });
});

req.end();