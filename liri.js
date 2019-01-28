require("dotenv").config();
const keys = require("./keys.js");

// modules
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

const spotify = new Spotify(keys.spotify);

// variables to user arguments - 2 & 3
var action = process.argv[2];
var input = process.argv[3];

for (var i = 4; i < process.argv.length; i++) {
  input += " " + process.argv[i];
}

Liri(action, input);

function Liri(action, input) {

  switch (action) {
    case "concert-this":
      concertThis(input)
      break;
    case "spotify-this-song":
      spotifyThis(input)
      break;
    case "movie-this":
      movieThis(input)
      break;
    case "do-what-it-says":
      doThis()
      break;
  }
};

// bands - concertThis
function concertThis(input) {
  // default
  if (input === undefined || input === " ") {
    input = "Sting";
  }

  let queryURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"

  axios.get(queryURL)
    .then(function (response) {
      // console.log(response);
      let bandData = response.data;
      for (let i = 0; i < bandData.length; i++) {

        console.log("Venue: ", bandData[i].venue.name);
        console.log("City: ", bandData[i].venue.city);
        console.log("Country: ", bandData[i].venue.country);
        console.log("Date: ", moment(bandData[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
        console.log("=====");
      }
    })
    .catch(function (error) {
      console.log(error);
    })
};

// spotify - spotifyThis
function spotifyThis(input) {
  // default
  if (input === undefined || input === " ") {
    input = "All Along the Watchtower";
  }

  spotify
    .search({
      type: 'track',
      query: input
    })
    .then(function (response) {
      // console.log(response);
      let spotData = response.tracks.items;
      for (let i = 0; i < spotData.length; i++) {

        console.log("Artist: " + spotData[i].artists[0].name);
        console.log("Song: " + spotData[i].name);
        console.log("Preview: " + spotData[i].preview_url);
        console.log("Album: " + spotData[i].album.name);
        console.log("=====");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// omdb - movieThis
function movieThis(input) {
  // default
  if (input === undefined || input === " ") {
    input = "Big";
  }
  
  let queryURL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

  axios.get(queryURL)
    .then(function (response) {
      // console.log(response);
      let movieData = response.data;

      console.log("Title: ", movieData.Title);
      console.log("Year: ", movieData.Year);
      console.log("Rated: ", movieData.Rated);
      console.log("IMDB Rating: ", movieData.imdbRating);
      console.log("Country: ", movieData.Country);
      console.log("Language: ", movieData.Language);
      console.log("Plot: ", movieData.Plot);
      console.log("Actors: ", movieData.Actors);

      if (movieData.Ratings[1]) {
        console.log("Rotten Tomatoes:", movieData.Ratings[1].Value);
      }
      console.log("=====");
    })
    .catch(function (error) {
      console.log(error);
    })
}

// random - doThis
function doThis() {
  let action;
  let input;

  // read text file - fs
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    const dataArr = data.split(",");

    for (let i = 0; i < dataArr.length; i++) {
      action = dataArr[i];
      i++;
      input = dataArr[i];
      Liri(action, input);
    }
  });
};