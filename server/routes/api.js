var express = require('express');
var router = express.Router();

// request to API-Football for team standings
router.get('/standings', async function (req, res) {
  const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
  
  try {
    const response = await fetch(`https://v3.football.api-sports.io/standings?league=39&season=2023`, {
      'method': 'GET',
      'headers': {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': FOOTBALL_API_KEY
      }
    });
    const data = await response.json();
    res.json(data);
  } catch {
    console.error('Error fetching standings');
  }
  });
  
  // request to API-Football for top scorers
  router.get('/topscorers', async function (req, res) {
    const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;

    try {
      const response = await fetch(`https://v3.football.api-sports.io/players/topscorers?season=2023&league=39`, {
        'method': 'GET',
        'headers': {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': FOOTBALL_API_KEY
        }
      });
      const data = await response.json();
      res.json(data);
    } catch {
      console.error('Error fetching top scorers');
    }
  });
  
  // request to NewsAPI for team news
  router.get('/news/:team', async function (req, res) {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    const team = req.params.team; // need team name to get relevant news articles
  
    try { // below, I had to include "English Premier League" in the query to the NewsAPI, in an effort to obtain more relevant articles
      const response = await fetch(`https://newsapi.org/v2/everything?q=${team}%20English%20Premier%League&sortBy=relevancy&language=en&pageSize=15&apiKey=${NEWS_API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch {
      console.error('Error fetching team news');
    }
  });
  
  // request to API-Football for teams info (used for venue location search)
  router.get('/teams', async function (req, res) {
    const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
  
    try {
      const response = await fetch(`https://v3.football.api-sports.io/teams?league=39&season=2023`, {
        'method': 'GET',
        'headers': {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': FOOTBALL_API_KEY
        }
      });
      const data = await response.json();
      res.json(data);
    } catch {
      console.error('Error fetching team venues');
    }
  });
  
  // request to Geoapify for locations near match venue
  router.get('/locations/:venue/:address/:city', async function (req, res) {
    const GEO_API_KEY = process.env.GEO_API_KEY;
    
    // need to use the venue, address, and city data to get the appropriate location coordinates for the search
    const venue = req.params.venue;
    const address = req.params.address;
    const city = req.params.city;
  
    try {
      // first, we have to get the longitude and latitude of the venue (using venue, address, and city data and ensuring the returned location is an amenity [football stadium] in England)
      const response1 = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${venue}%20${address}%20${city}&type=amenity&lang=en&filter=countrycode:gb&format=json&apiKey=${GEO_API_KEY}`);
      const data1 = await response1.json();
      const results1 = data1.results;
  
      // saving longitude & latitude
      const lon = results1[0].lon;
      const lat = results1[0].lat;
  
      // next, we can use the coordinates of the stadium (lat, long) to call Geoapify Places to get a list of the surrounding bars and pubs (limited to 10, results in english)
      const response2 = await fetch(`https://api.geoapify.com/v2/places?bias=proximity:${lon},${lat}&categories=catering.bar,catering.pub&limit=10&lang=en&apiKey=${GEO_API_KEY}`);
      const data2 = await response2.json();
      const results2 = data2.features;
      res.json(results2);
    } catch {
      console.error('Error fetching locations');
    }
  });

module.exports = router;
