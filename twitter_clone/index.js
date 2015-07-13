//127.0.0.1:3000/api/tweets?userId=billgates
//when we see api/tweets, we respond with tweet objects
//key-value pairs of url query params, used by the app to filter the tweets

var express = require('express')
var fixtures = require('./fixtures')

var app = express()

var bodyParser = require('body-parser')

var cookieParser = require('cookie-parser')
var session  = require('express-session')
var passport = require('./auth')
var jsonParser = bodyParser.json()

var conn = require('./db'),
    User = conn.model('User'),
    Tweet = conn.model('Tweet');

app.use(jsonParser)
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

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
});

function ensureAuthentication(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.sendStatus(403);
    } else {
        return next();
    }
}

var _ = require('lodash')
app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
    var tweetId = req.params.tweetId;
    var removedTweets = fixtures.tweets.filter(
        function(tweet) {
            return tweet.id === tweetId
        }
    );
    if (removedTweets.length == 0) {
        return res.sendStatus(404)
    }
    if (removedTweets[0].userId !== req.user.id) {
        return res.sendStatus(403)
    }
    var index = fixtures.tweets.indexOf(removedTweets[0]);
    fixtures.tweets.splice(index, 1);
    res.sendStatus(200)
})

 
app.post('/api/users', function(req,res) {
    if (!req.body || !req.body.user) return res.sendStatus(400)
    else {
        var newUser = req.body.user
        var addUser = new User({id: newUser.id, name: newUser.name, email: newUser.email, password: newUser.password, followingIds:[]});
        addUser.save(function(err) {
            if(err) { 
                var code = err.code === 11000 ? 409 : 500;
                return res.sendStatus(code); 
            } else {
                req.login(addUser, function(err) {
                    if(err) {
                        return res.sendStatus(500);
                    }
                    res.sendStatus(200)
                });
            }
        });
    }
});

var shortId = require('shortid')
app.post('/api/tweets', ensureAuthentication, function(req,res) {
    if(!req.body || !req.body.tweet) return res.sendStatus(400)
    else {
        if(!req.user.id) {
            return res.sendStatus(403)
        }
        var tweets = fixtures.tweets
        var uniqueId = shortId.generate()
        var newTweet = req.body.tweet;
        newTweet.id = uniqueId
        newTweet.created = Math.round((new Date()).getTime() / 1000)
        newTweet.userId = req.user.id;
        tweets.push(newTweet)
        res.status(200).send(req.body)
    }
});


app.post('/api/auth/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    if (err) { return res.sendStatus(500); }
    if (!user) { return res.sendStatus(403); }
    req.logIn(user, function(err) {
      if (err) { return res.sendStatus(403) }
      return res.status(200).send({"user": user});
    });
  })(req, res, next);
});

app.post('/api/auth/logout', function(req, res, next) {
    req.logout();
    res.sendStatus(200)
}) 

var config = require('./config')

var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server
