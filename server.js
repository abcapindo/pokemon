var express = require('express');
var app = express();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
})

// var sorting = function(ordering) {
//     if
// }

var sorting = [{
    "id": {
        "order": "asc",
        "unmapped_type": "long"
    }
}, {
    "name": {
        "order": "asc",
        "unmapped_type": "string"
    }
}, {
    "attack.stat": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "defense.stat": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "special_attack.stat": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "special_defense.stat": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "speed.stat": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "hp.stat": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "id": {
        "order": "desc",
        "unmapped_type": "long"
    }
}, {
    "name": {
        "order": "desc",
        "unmapped_type": "string"
    }
}, {
    "attack.stat": {
        "order": "asc",
        "unmapped_type": "long"
    }
}, {
    "defense.stat": {
        "order": "asc",
        "unmapped_type": "long"
    }
}, {
    "special_attack.stat": {
        "order": "asc",
        "unmapped_type": "long"
    }
}, {
    "special_defense.stat": {
        "order": "asc",
        "unmapped_type": "long"
    }
}, {
    "speed.stat": {
        "order": "asc",
        "unmapped_type": "long"
    }
}, {
    "hp.stat": {
        "order": "asc",
        "unmapped_type": "long"
    }
}]

app.use(express.static('public'));

app.get('/api/search/pokemon/:id', function(req, res) {
    client.search({
        body: {
            query: {
                match: {
                    id: {
                        query: req.params.id
                    }
                }
            }
        }
    }).then(function(body) {
        var result = body.hits.hits[0]._source;
        res.send(result)
    }, function(error) {
        res.send(error.message);
    })
});

app.get('/api/pokemon/:start/:step/:sortBy', function(req, res) {
    sort = sorting[parseInt(req.params.sortBy)]
    client.search({
        body: {
            sort: sort,
            from: req.params.start,
            size: req.params.step,
            query: {
                match_all: {}
            }
        }
    }).then(function(body) {
        var result = body;
        var list = [];
        for (x in result.hits.hits) {
            list.push(result.hits.hits[x]._source);
        }
        response = {
            "list": list,
            "hits": result.hits.total
        }
        res.send(response);
    }, function(error) {
        res.send(error.message);
    });
});

app.get('/types', function(req, res) {
    res.send({
        "types": [{
            "name": "Electric",
            "value": "electric"
        }, {
            "name": "Water",
            "value": "Water"
        }, {
            "name": "Fire",
            "value": "fire"
        }, {
            "name": "Grass",
            "value": "grass"
        }, {
            "name": "Ground",
            "value": "ground"
        }, {
            "name": "Rock",
            "value": "rock"
        }, {
            "name": "Flying",
            "value": "flying"
        }, {
            "name": "Psychic",
            "value": "psychic"
        }, {
            "name": "Ghost",
            "value": "ghost"
        }, {
            "name": "Dark",
            "value": "dark"
        }, {
            "name": "Bug",
            "value": "bug"
        }, {
            "name": "Dragon",
            "value": "dragon"
        }, {
            "name": "Fairy",
            "value": "fairy"
        }, {
            "name": "Poison",
            "value": "poison"
        }, {
            "name": "Fighting",
            "value": "fighting"
        }, {
            "name": "Normal",
            "value": "normal"
        }, {
            "name": "Ice",
            "value": "ice"
        }, {
            "name": "Steel",
            "value": "steel"
        }]
    });
});

app.listen(3000, function() {
    console.log('Server listening on port 3000.');
});
