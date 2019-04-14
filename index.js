import express from "express";
import bodyParser from "body-parser";
import Twitter from "twitter";

// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.listen((process.env.PORT || 5000));

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

var client = new Twitter({
  consumer_key: 'ot1g7GTLCqlvbW0Q8OWf271PA',
  consumer_secret: 'WkBInsATcr525W0YTVlu4glSX4Eyslvxqi3ZrCGMZWNFR6QCqK',
  access_token_key: '64763284-lwyypadUJWbzWD4HijTFGjTq2lCpW1UVGIKrw38xo',
  access_token_secret: '1Mj3vmOeKdEVM9Iim73ZUvFCpUXzgh9uXrJx84OfGmEB0'
});

// client.post('statuses/update', {status: 'I am a tweet'}, function(error, tweet, response) {
//   if (!error) {
//     console.log(tweet);
//   }
// });

// client.get('search/tweets', {q: '#helpme'}, function(error, tweets, response) {
//    console.log(tweets.statuses.length);
// });

client.get('statuses/mentions_timeline', {count: 10}, (error, tweets, response) => {
	console.log(tweets);
})