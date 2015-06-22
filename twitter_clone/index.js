//127.0.0.1:3000/api/tweets?userId=billgates
//when we see api/tweets, we respond with tweet objects
//key-value pairs of url query params, used by the app to filter the tweets

var express = require('express')
var fixtures = require('./fixtures')

var app = express()

app.get('/api/users/:userId', function(req,res) {
    var userId = req.params.userId
    if(!userId) {
        return res.sendStatus(400)
    }
    var users = fixtures.users.filter(
        function(user) {
            return user.id === userId
        }
    )
    if (users.length === 0) {
        return res.sendStatus(404)
    }
    return res.send({user: users[0]})
})
app.get('/api/tweets', function(req,res) {
    var userId = req.query.userId;
    if(!userId) {
        return res.sendStatus(400)
    }

    var tweets = fixtures.tweets.filter(function(tweet) {
        if('userId' in tweet && tweet.userId === userId) {
            return true
        } else {
            return false
        }
    })
    var sortedTweets = tweets.sort(function(t1, t2) {
        if(t1.created > t2.created) {
            return -1
        } else if (t1.created === t2.created) {
            return 0
        } else {
            return 1
        }
    })

    return res.send({
        tweets: sortedTweets
    })
})

var server = app.listen(3000, '127.0.0.1')

module.exports = server
