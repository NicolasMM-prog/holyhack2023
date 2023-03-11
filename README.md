# HOLY HACK 2023

This project is Binary Bandit's entry for 2023's edition of Holy Hack, organised by Academics For Technology. 
The challenge set upon by Easi was to develop a product, device or service that creates a new or improved form of insurance or financial tool for businesses and consumers based on challenges and opportunities within the Fintech industry. 
One such challenge is the lack of mobile app development expertise in the fintech industry.
Binary Bandits's solution is ShopCheap, a mobile app that aims to optimize cost-effective grocery shopping by providing a detailed overview of grocery products across common Belgian supermarkets such as Delhaize, Colruyt and Albert Heijn. 

## Frontend

Our frontend is an app, written in FLutter to support all platforms. It serves as a companion, which lists all shopping lsits and their respective items.
When a customer searches for a product using the search bar, a JSON request is sent to the backend using the HTTP protocol. The backend sends a list of products based on two parameters: relevancy and price per kilogram. 
This data is then displayed for the customer in the app, giving the option to accept the suggested product or not. This way customers of ShopCheap can find the cheapest grocery products across multiple supermarket chains.


## Backend 

Grocery data from the three biggest supermarkets (Colruyt, Albert Heijn and Delhaize) is fetched by the Typescript backend.
The most relevent items are saved by product name, brand, price, weight and price per kilo or liter. They are then sorted by price per kilogram and per supermarket. 
It validates and cleans the product names and sends them to the frontend in a format it understands.

## Future ideas

This app can be expanded in unlimited ways. Some ideas include syncing between devices and sharing shopping lists, as well as
creating a route to the supermarkets. The possibilities are endless, and this repository contains the most important parts to showcase the project.



