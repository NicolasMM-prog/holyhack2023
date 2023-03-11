# HOLY HACK 2023

This project is Binary Bandit's entry for 2023's edition of Holy Hack, organised by Academics For Technology. 
The challenge set upon by Easi was to develop a product, device or service that creates a new or improved form of insurance or financial tool for businesses and consumers based on challenges and opportunities within the Fintech industry. 
One such challenge is the lack of mobile app development expertise in the fintech industry.
Binary Bandits's solution is ShopCheap, a mobile app that aims to optimize cost-effective grocery shopping by providing a detailed overview of grocery products across common Belgian supermarkets such as Delhaize, Colruyt and Albert Heijn. 



## Frontend


When a customer searches for a product using the search bar, a JSON request is sent to the backend using the HTTP protocol to send a list of products based on two parameters: relevancy and price per kilogram. 
This data is then displayed to the customer in the app, giving the option to accept the suggested product or not. This way customers of ShopCheap can find the cheapest grocery products across multiple supermarket chains.


## Backend 

When a customer searches for a product it would like to buy, ShopCheap gives a list of products ranked on relevancy and ascending price order.
This way customers can view and choose what product they would like to add to their shopping cart.

Grocery data such as product name, price, weight, etc. are processed by webscraping the grocery markets' website. 
When a customer inputs a product it would like 
The Cheerio library is used to parse the HTML code into a structured format



