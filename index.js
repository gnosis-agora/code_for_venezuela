import express from "express";
import bodyParser from "body-parser";
import Twitter from "twitter";
import {upsert_user, upsert_supplier, get_matches} from "./mongoMethods";

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

var client = new Twitter({
  consumer_key: 'ot1g7GTLCqlvbW0Q8OWf271PA',
  consumer_secret: 'WkBInsATcr525W0YTVlu4glSX4Eyslvxqi3ZrCGMZWNFR6QCqK',
  access_token_key: '64763284-lwyypadUJWbzWD4HijTFGjTq2lCpW1UVGIKrw38xo',
  access_token_secret: '1Mj3vmOeKdEVM9Iim73ZUvFCpUXzgh9uXrJx84OfGmEB0'
});

app.get("/", (req, res) => {
  res.send("hello world");
});

var sendStatus = (user_in_need, helpers, location, medicine) => {
	let helper_string = '';
	helpers.forEach(helper => {
		helper_string += `@${helper} `
	})
	let status = `Hey @${user_in_need}, you can find ${helper_string}for the medicine ${medicine}. They are located in ${location}`;
	return status
}

setInterval(() => {
	// Get users who need medication
	client.get('search/tweets', {q: '#VeneMedicina'}, function(error, tweets, response) {
		let tweet_collection = tweets.statuses;
		tweet_collection.forEach((tweet) => {
			let user = tweet.user.screen_name;
			let timestamp = tweet.created_at;
			let medicine = 'insulin 50mg';
			let location = 'san francisco';
			upsert_user(user, medicine, location, timestamp);
		})
	});
	// Get users who have medication
	client.get('statuses/mentions_timeline', {count: 1}, (error, tweets, response) => {
		tweets.forEach((tweet) => {
			let user = tweet.user.screen_name;
			let timestamp = tweet.created_at;
			let medicine = 'insulin 50mg';
			let location = 'san francisco';
			upsert_supplier(user, medicine, location, timestamp);
		})
	})
	// Match users from DB and send out post
	get_matches().then(match => {
		let status_string = sendStatus(match.user, match.suppliers, match.location, match.medicine)
		client.post('statuses/update', {status: status_string}, function(error, tweet, response) {
		  if (!error) {
		    console.log(tweet);
		  }
		});
	})
})


