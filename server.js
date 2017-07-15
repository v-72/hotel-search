/*



Problem Statement:

Search the availibility of hotel for a given property for a given duration using google search.



1.Get property name, checkin date and duration from the user

2.Construct google search url

3.Parse the search result for list of sites offering the booking and price they are offering.

4.Send the list of site - price details to the requester.



Libraies:

a. express library to create the server. 

b. body-parser and express-validator to parse and validate the request.

c. cheerio to parse the html result and query. 

*/
'use strict'

var express = require('express'),

    rp = require('request-promise'),

    bodyParser = require('body-parser'),

    cheerio = require('cheerio'),

    expressValidator = require('express-validator');



//Initilizing express app

var app = express();



//Initilizing bodyParser middleware

app.use(bodyParser.json());

app.use(expressValidator());

/**

* @api {get} /search?hotelName=<hotel name>S&checkInDate=<checkIn Date>&duration=<duration of stay>

* @apiName SearchQuery

*

* @apiSampleRequest http://localhost:8000/search?hotelName=Taj%20West%20End&checkInDate=2017-12-25&duration=1

* @apiSuccess {Object} List Array of search results

*/

app.get('/search', (req, res) => {

    req.checkQuery('hotelName', 'Invalid hotelName').notEmpty();

    req.checkQuery('checkInDate', 'Invalid checkInDate').notEmpty();

    req.checkQuery('duration', 'Invalid duration').notEmpty();

    var errors = req.validationErrors();

    if (errors) {

        res.status(400).send({
            success: false,
            error: errors
        });

        return;

    }

    let _googleSearchQuery = "https://www.google.com/search?q=" + req.query.hotelName + "&ahotel_dates=" + req.query.checkInDate + "%2C7#ahotel_dates=" + req.query.checkInDate + "," + req.query.duration;

    console.log(_googleSearchQuery);

    let searchResults = [];

    //Calling google search with request query paramaters

    rp(_googleSearchQuery).then((googleResult) => {

        console.log(googleResult)

        let $ = cheerio.load(googleResult) // Load html to cheerio html parser

        $('.lhpr-content-item').each(function(i, elem) {

            searchResults.push({

                "site": $(this).find('span ._Zjf').text(),

                "link": $(this).find('a ._dkf').attr('href'),

                "price": $(this).find('._FQr ._V0p').text()

            })

            res.status(200).send({
                success: true,
                result: searchResults
            });

        })

    }).catch((err) => {

        console.log(err)

        res.status(500).send({
            "message": "Something went wrong",
            "error": err
        })

    })

})



//Listening app in port 8000

app.listen(8000, () => {
    console.log('Listening at 8000')
});
