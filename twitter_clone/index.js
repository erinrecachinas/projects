//127.0.0.1:3000/api/tweets?userId=billgates
//when we see api/tweets, we respond with tweet objects
//key-value pairs of url query params, used by the app to filter the tweets

var express = require('express')
var fixtures = require('./fixtures')

var app = express()

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

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

app.get('/api/tweets/:tweetId', function(req, res) {
    var tweetId = req.params.tweetId
    if(!tweetId) return res.sendStatus(400)
    var tweets = fixtures.tweets.filter(
        function(tweet) {
            return tweet.id === tweetId
        }
    )
    if(tweets.length === 0) {
        return res.sendStatus(404)
    }
    return res.status(200).send({tweet: tweets[0]})
})
var _ = require('lodash')
app.delete('/api/tweets/:tweetId', function(req, res) {
    var removedTweets = _.remove(fixtures.tweets, 'id', req.params.tweetId)

    if (removedTweets.length == 0) {
        return res.sendStatus(404)
    }

    res.sendStatus(200)
})

/*
POST /api/users

with JSON message body:

{ "user": {
    "id": "peter",
    "name": "Peter Thiel",
    "email": "peter@thiel.com",
    "password": "investor"
  }
}
returns

{
  id: 'peter',
  name: 'Peter Thiel',
  email: 'peter@thiel.com',
  password: 'investor',
  followingIds: []
}

app.post('/api/users', function(req, res) {
  var user = req.body.user

  if (_.find(fixtures.users, 'id', user.id)) {
    return res.sendStatus(409)
  }

  user.followingIds = []
  fixtures.users.push(user)

  res.sendStatus(200)
})
*/
app.use(jsonParser)

app.post('/api/users', function(req,res) {
    if (!req.body || !req.body.user) return res.sendStatus(400)
    else {
        var users = fixtures.users
        var newUser = req.body.user
        var existingUser = users.filter(function(user) {
            return newUser.id === user.id
        })
        if(existingUser.length > 0) {
            return res.sendStatus(409)
        } else {
            var addUser = {id: newUser.id, name: newUser.name, email: newUser.email, password: newUser.password, followingIds:[]}
            users.push(addUser)
            res.sendStatus(200)
        }
    }
})
var shortId = require('shortid')
app.post('/api/tweets', function(req,res) {
    if(!req.body || !req.body.tweet) return res.sendStatus(400)
    else {
        var tweets = fixtures.tweets
        var uniqueId = shortId.generate()
        var newTweet = req.body.tweet;
        newTweet.id = uniqueId
        newTweet.created = Math.round((new Date()).getTime() / 1000)
        tweets.push(newTweet)
        res.status(200).send(req.body)
    }
})

var server = app.listen(3000, '127.0.0.1')

module.exports = server
