 # Basic description

 REST (Representational State Transfer) is a standard architecture for building and communicating with web services, It typically mandates resources on the web are represented in a text format (like JSON, HTML, or XML) and can be accessed or modified by a predetermined set of operations.<br> Given that we typically build REST APIs to leverage with HTTP instead of other protocols, these operations correspond to HTTP methods like GET, POST, or PUT.

Here's a RESTful API that interacts with a PostgreSQL database written in NodeJS with Typescript, Restify, and the sequelize ORM.
  
If a "PORT" environment variable has not been defined then the application currently defaults to port 15100 (see ./src/server.ts).  
  
To start via the terminal navigate to the source code directory and run the following commands (after install "rebuild" will be run automatically)...  
`$ npm install`  
`$ npm run (re)build`  
`$ npm run start`  

 # Example HTTP requests via cURL (be sure to update as needed)
 ## Create a product
`curl -i -s -H "Content-Type: application/json" -X POST -d '{"lookupCode":"lookupcode4","count":175}' https://byolabisi.herokuapp.com/api/product/`  
 ## Update an existing product by record ID
`curl -i -s -H "Content-Type: application/json" -X PUT -d '{"id":"bee20aed-5245-46a7-b19c-9ef6abd4ca5c","lookupCode":"lookupcode4","count":200}' https://byolabisi.herokuapp.com/api/product/bee20aed-5245-46a7-b19c-9ef6abd4ca5c`  
 ## Delete an existing product by record ID
`curl -i -s -X DELETE https://byolabisi.herokuapp.com/api/product/bee20aed-5245-46a7-b19c-9ef6abd4ca5c`  