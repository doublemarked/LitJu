var restify = require('restify');
var db = require('./db');
var util = require('./util');

module.exports.court_by_id = function (req, res, next) {
    db.Court.find(req.params[0]).success(function (court) {
        console.log("COURT: "+JSON.stringify(court, null, 3));
        res.send(court);
    });

    return next();
};

module.exports.courts = function (req, res, next) {
    var filter = {};
    var type = req.params.type;
     
    if (type) {
        if (db.Court.types.indexOf(type) === -1) {
            return next(new restify.InvalidArgumentError("Invalid filter argument '"+type+"'"));
        }
        filter.type = type;
    }

    db.Court.findAll({where: filter}).success(function (courts) {
        res.send(courts);
    }); 

    return next();
};

module.exports.court_judges = function (req, res, next) {
    var id = req.params.id;

    db.Assignment.findAll({where: { courtid:id }, include: [db.Judge] }).success(function (assignments) {
        var judges = assignments.map(function (o) { return o.judge; });
        res.send(judges);
    });

    return next();
};

module.exports.judge_by_id = function (req, res, next) {
    db.Judge.find(req.params[0]).success(function (judge) {
        console.log("JUDGE: "+JSON.stringify(judge, null, 3));
        res.send(judge);
    });

    return next();
};

module.exports.judges = function (req, res, next) {
    db.Judge.findAll().success(function (judges) {
        console.log("JUDGES: "+JSON.stringify(judges, null, 3));
        res.send(judges);
    }); 

    return next();
};

module.exports.judge_assignments = function (req, res, next) {
    var id = req.params.id;

    db.Assignment.findAll({where: { JudgeId:id }, include: [db.Court] }).success(function (assignments) {
        var courts = assignments.map(function (o) { return o.court; });
        res.send(courts);
    });

    return next();
};

