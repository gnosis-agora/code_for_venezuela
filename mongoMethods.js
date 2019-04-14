import assert from "assert";
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://heroku_26tnrsxg:2nptktb72q5mlutqppkt0dhkna@ds139896.mlab.com:39896/heroku_26tnrsxg';

export const upsert_user = (twitter_username, drugs_required, location, timestamp) => {
    let data = {twitter_username: twitter_username,
                drugs_required: drugs_required,
                location: location,
                timestamp: timestamp}
    MongoClient.connect(url , (err, db) => {
        if (err) {
          console.log('upsert_user');
          console.log(err);
        }
        db.collection('users').update(
          {twitter_username : twitter_username},
          data,
          {upsert: true}
        );
        db.close();
    });
};

export const upsert_supplier = (twitter_username, drugs_possessed, location, timestamp) => {
    let data = {twitter_username: twitter_username,
                drugs_possessed: drugs_possessed,
                location: location,
                timestamp: timestamp}
    MongoClient.connect(url , (err, db) => {
        if (err) {
          console.log('update_supplier');
          console.log(err);
        }
        db.collection('suppliers').update(
          {twitter_username : twitter_username},
          data,
          {upsert: true}
        );
        db.close();
    });
};

const fetch_request = async () => {
    let user;
    const db = await MongoClient.connect(url);
    user = await db.collection('users').findOne();
    return user;
};

const find_suppliers = async (user) => {
    const db = await MongoClient.connect(url);  
    let suppliers = await db.collection('suppliers').find({drugs_possessed: user.drugs_required[0], location: user.location}).toArray();
    // console.log('suppliers:\n')
    // console.log(suppliers)
    return suppliers.length > 3 ?  suppliers.slice(1,4) : suppliers
};

export const get_matches = async () => {
    let user = await fetch_request()
    let suppliers = await find_suppliers(user)
    let matched = {
        twitter_username: user.twitter_username,
        location: user.location,
        medicine: user.drugs_required[0],
        suppliers: suppliers
    }
    // user.drugs_required.splice(0, 1) // removes the first drug required
    // upsert_user(user.twitter_username, user.drugs_required, user.location, user.timestamp)
    return matched
}