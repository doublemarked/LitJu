var csv = require('csv');

exports.data_path = "data/";
if (process.argv.length > 2) {
    exports.data_path = process.argv[2];
}


exports.Court = function (props) {
    if (!props) props = {};

    this.id = props.id;
    this.name = props.name;
    this.type = props.type;

    this.stats = new exports.Stats(props.stats);
};

exports.Stats = function (props) {
    if (!props) props = {};

    this.workdays = props.workdays || 0;
    this.workload = props.workload || 0;
    this.cases = props.cases || {
        criminal: { total: 0, len_lt6m: 0, len_6m12m: 0, len_gt12m: 0, len_avg: 0 },
        civil: { total: 0, len_lt6m: 0, len_6m12m: 0, len_gt12m: 0, len_avg: 0 },
        admin: { total: 0, len_lt6m: 0, len_6m12m: 0, len_gt12m: 0, len_avg: 0 }
    };
};

// Note: We don't add workload which is a non scalar 
exports.Stats.prototype.add = function (stats) {
    this.workdays += stats.workdays;
    
    for (var p in this.cases) {
        for (var k in this.cases[p]) {
            this.cases[p][k] += stats.cases[p][k];
        }
    }
};

exports.Judge = function(props) {
    if (!props) props = {};

    this.id = props.id;
    this.name = props.name;

    this.stats = new exports.Stats(props.stats);
};

// Judges may be active in different courts throughout the year
exports.Assignment = function (props) {
    if (!props) props = {};

    this.court_id = props.court_id;
    this.judge_id = props.judge_id;

    this.id = this.court_id+"_"+this.judge_id;

    this.stats = new exports.Stats(props.stats);
};

// Wrapper for CSV file processing
exports.csv = function (file, callback, processor) {
    csv()
    .from.path(exports.data_path + "/csv/"+file+".csv")
    .on('record', processor)
    .on('end', callback);
};

exports.isBlank = function (row, index) {
    for(var i=index; i<row.length; i++) {
        if (row[i] != "") return false;
    }
    return true;
};

exports.seriesExec = function (context, series) {
    var c = series.shift();
    c(context, function () {
        if (series.length > 0)
            exports.seriesExec(context, series);
    });
};

exports.dump = function(context, callback) {
    console.log(JSON.stringify(context, null, 3));
    callback();
};

exports.aggregate = function(context, callback) {
    var workloads = { 
        store: {},
        add: function (obj, type, wl) {
            var key = type+obj.id;
            if (!workloads.store[key]) {
                workloads.store[key] = { obj: obj, values: [] };
            }
            workloads.store[key].values.push(wl);
        }
    };

    Object.keys(context.assignments).forEach(function (key) {
        var jca = context.assignments[key];

        var court = context.courts[jca.court_id];
        var judge = context.judges[jca.judge_id];

        court.stats.add(jca.stats);
        judge.stats.add(jca.stats);

        workloads.add(court, 'court', jca.stats.workload);
        workloads.add(judge, 'judge', jca.stats.workload);
    });

    Object.keys(workloads.store).forEach(function (key) {
        var wls = workloads.store[key];
        wls.obj.stats.workload = wls.values.reduce(function (a,b) { return a+b; }) / wls.values.length;
    });

    callback();
};

