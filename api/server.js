var restify = require('restify');
var routes = require('./routes');
var config = require('./config');
var db = require('./db');

var server = restify.createServer({
    name: 'LitJu API',
    version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
// Always unicode
server.use(function (req, res, next) {
    res.charSet('utf8');
    next();
});

db.init(false, function () {
    server.listen(config.port, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
});


/** ROUTES **/

server.get('/courts', routes.courts);
server.get(/\/courts\/(\d+)$/, routes.court_by_id);
server.get('/courts/:type', routes.courts);
server.get('/courts/:id/judges', routes.court_judges);

server.get('/judges', routes.judges);
server.get(/\/judges\/(\d+)$/, routes.judge_by_id);
server.get('/judges/:id/assignments', routes.judge_assignments);

