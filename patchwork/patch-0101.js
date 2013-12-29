"use strict";

var pwt = require('./patchwork-tools');

/* FILE 0101
 * Contains district and county judge & court data
 */

exports.exec = function(context, callback) {
    var courts = context.courts;
    var judges = context.judges;
    var assignments = context.assignments;

    var court = null;

    pwt.csv("0101", callback, function (row, index) {
        var id = parseInt(row[0]);
        if (!id) { return; }
        var name = row[1];
        var isCourt = pwt.isBlank(row, 2); // Courts have blank values beyond col 1
       
        if (isCourt) {
            court = courts[id] = new pwt.Court({ id: id, name: name });
            court.type = (index < 581) ? 'district' : 'county';
            return;
        }

        var judge = judges[id];
        if (!judge) {
            judge = judges[id] = new pwt.Judge({id: id, name: name});
        } else if (judge.name != name) {
            console.error("COLLISION on judge id="+id+": name mismatch '"+name+"' != '"+judge.name+"'");
            return process.exit();
        }


        var jca = new pwt.Assignment({ court_id: court.id, judge_id:judge.id});
        if (assignments[jca.id]) {
            console.error("COLLISION ON assignment "+jca.id);
            return process.exit();
        }

        jca.stats.workdays = parseInt(row[18]),
        jca.stats.workload = parseFloat(row[2]),
        jca.stats.cases.criminal.total = parseInt(row[4]);
        jca.stats.cases.civil.total = parseInt(row[8]);
        jca.stats.cases.admin.total = parseInt(row[12]);

        assignments[jca.id] = jca;
    });
};

