# hotel-search

Problem Statement:

Search the availability of hotel for a given property for a given duration using google search.


1.Get property name, checkin date and duration from the user

2.Construct google search url

3.Parse the search result for list of sites offering the booking and price they are offering.

4.Send the list of site - price details to the requester.



Libraies:

a. express library to create the server. 

b. body-parser and express-validator to parse and validate the request.

c. cheerio to parse the html result and query. 

