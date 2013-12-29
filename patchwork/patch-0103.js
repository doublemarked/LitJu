var csv = require('csv');
var pwt = require('./patchwork-tools');

/* FILE 0103
 * Contains Lithuanian high court & judge data
 */
exports.exec = function(context, callback) {
    var courts = context.courts;
    var judges = context.judges;
    var assignments = context.assignments;

    var court = courts[-1] = new pwt.Court({
        id: -1, 
        name: "Lietuvos Aukščiausiasis teismas",
        type: "supreme"
    });

    pwt.csv("0103", callback, function (row, index) {
        var id = parseInt(row[0]);
        if (!id) { return; }
        var name = row[1];

        var judge = judges[id];
        if (judge) {
            if (judge.name != name) {
                console.error("COLLISION on judge id="+id+": name mismatch '"+name+"' != '"+judge.name+"'");
                return process.exit();
            }
        } else {
            judge = judges[id] = new pwt.Judge({id: id, name: name});
        }

        var jca = new pwt.Assignment({ court_id: court.id, judge_id:judge.id});
        if (assignments[jca.id]) {
            console.error("COLLISION ON assignment "+jca.id);
            return process.exit();
        }

        jca.stats.cases.criminal.total = parseInt(row[2]);
        jca.stats.cases.civil.total = parseInt(row[7]);
        jca.stats.cases.admin.total = parseInt(row[12]);

        assignments[jca.id] = jca;
    });
};
