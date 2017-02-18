var express = require('express');
var unirest = require('unirest');
var events = require('events');
var app = express();
app.use(express.static('public'));

const appKey = '3496890aba200994faf90d5a21a6bdfd';
const appId = '1ef25e18';

// function that gets data from api
var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    unirest.get('http://api.yummly.com/v1/api/' + endpoint)
        .qs(args)
        .end(function(response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            } else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
}

// we use express to listen for a route
app.get('/recipes', function(req, res) {

    // dishes in this case is a query, NOT an argument
    var dishes = req.query.food;

    // give recipeReq the value that we receive when we call getFromApi
    var recipeReq = getFromApi('recipes', {
        q: dishes,
        _app_id: appId,
        _app_key: appKey,
        maxResult: 16,
        start: 16
    });

    recipeReq.on('end', function(data) {
        res.json(data)
    });
    recipeReq.on('error', function(code) {
        res.sendStatus(code);
    })
});

// we use express to listen to recipes and a certain type of diet
app.get('/recipes/:diet', function(req, res) {

    // we'll store our req.params.diet (passed in route) to diet
    var diet = req.params.diet;
    var recipeReq = getFromApi('recipes', {
        _app_id: appId,
        _app_key: appKey,
        maxResult: 16,
        start: 16,
        allowedDiet: diet
    });

    recipeReq.on('end', function(data) {
        console.log(data);
        res.json(data)
    });
    recipeReq.on('error', function(code) {
        res.sendStatus(code);
    })
});


// have another function that gets all the nutrional facts
var getNutrionalFacts = function(id) {
    var emitter = new events.EventEmitter();
    unirest.get(`http://api.yummly.com/v1/api/recipe/${id}?_app_id=${appId}&_app_key=${appKey}`)
        .end(function(response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            } else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
}

// use unirest to listen for route recipe and
app.get('/recipe/:id', function(req, res) {
    var id = req.params.id
    var nutritional = getNutrionalFacts(id)
    nutritional.on('end', function(data) {
        res.json(data);
    })
    nutritional.on('error', function(code) {
        res.sendStatus(code);
    })
})



app.listen(process.env.PORT || 8080);
