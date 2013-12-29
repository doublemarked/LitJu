var async = require('async');
var db = require("./db");

if (process.argv.length < 3) {
    console.error("Usage: node "+process.argv[1]+" <content json>");
    process.exit(1);
}

var content = require("../"+process.argv[2]);
var cache = { courts: {}, judges: {} };

console.log("Importing to database...");

db.init(true, function () {
    async.parallel([
        function (callback) { store_all('courts', callback); },
        function (callback) { store_all('judges', callback); }
    ], function (err) {
        if (err) { 
            console.error("Error executing parallel: "+err);
            process.exit(1);
        }

        Object.keys(content.assignments).forEach(function (id) {
            var jca = content.assignments[id];
            var court = cache.courts[jca.court_id];
            var judge = cache.judges[jca.judge_id];

            var assignment = db.Assignment.build({ start: new Date(), finish: null, stats: jca.stats });
            assignment.save().success(function () {
                assignment.setCourt(court);
                assignment.setJudge(judge);
            });
        });
    });
});

function store_all(type, callback) {
    var keys = Object.keys(content[type]);
    var records = keys.length;
    keys.forEach(function (id) {
        store(content[type][id], type, function (obj) {
            cache[type][id] = obj;
            if (--records == 0) {
                callback();
            }
        });
    });
};

function store(obj, type, callback) {
    var pobj;
    if (type === 'courts') {
        pobj = db.Court.build(obj);
    } else {
        pobj = db.Judge.build(obj);
    }

    pobj.save().success(function () {
        callback(pobj); 
    });
};
