var csv = require('csv');
var pwt = require('./patchwork-tools');

/* FILE 0102
 * Contains appelate court & judge data
 */
exports.exec = function(context, callback) {
    var courts = context.courts;
    var judges = context.judges;
    var assignments = context.assignments;

    var court = null;

    pwt.csv("0102", callback, function (row, index) {
        var id = parseInt(row[0]);
        if (!id) { return; }
        var name = row[1];
        var isCourt = pwt.isBlank(row, 2); // Courts have blank values beyond col 1

        if (isCourt) {
            court = courts[id];
            if (!court) {
                console.warn("SKIPPING Unknown court "+id);
            }

            return;
        }

        if (!court) {
            // Skipping until next court set
            return;
        }

        var judge = judges[id];
        if (!judge) {
            console.error("CONFLICT: Unknown judge "+id);
            process.exit();
        }

        var jca = assignments[ court.id+"_"+judge.id ];
        if (!jca) {
            console.error("CONFLICT: Unknown Assignment for court "+court.id+" for judge "+id);
            process.exit();
        }

        jca.stats.cases.criminal.total += parseInt(row[3]);
        jca.stats.cases.civil.total += parseInt(row[7]);
        jca.stats.cases.admin.total += parseInt(row[11]);
    });
};
