var fs = require('fs');
var csv = require('csv');
var pwt = require('./patchwork-tools');

/* FILE 0301
 * XLS file 0201 contained many sheets - one for each court ID. We've exported
 * those sheets to separate files, and must extract data from each of them.
 * These sheet files are straight exports from the XLS sheets, and have not had
 * header/footer data removed.
 */
exports.exec = function(context, callback) {
    fs.readdir(pwt.data_path+"/csv/0301/", function (err, files) {
        if (err) throw err;

        var remaining = files.length;
        files.forEach(function (filename) {
            extract(filename, context, function () {
                if (--remaining == 0) {
                    callback();
                }
            });
        });

    });
};

function extract(filename, context, callback) {
    var id = parseInt(filename);
    if (!id) { callback(); return; }

    var court = context.courts[id];
    if (!court) {
        console.error("CANNOT LOCATE COURT: "+id);
        process.exit();
    }

    pwt.csv("0301/"+id, callback, function (row, index) {
        switch (index) {
            case 16:
                court.stats.cases.civil.len_avg = parseFloat(row[2]);
                break;
            case 17:
                court.stats.cases.civil.len_lt6m = parseInt(row[2]);
                break;
            case 18:
                court.stats.cases.civil.len_6m12m = parseInt(row[2]);
                break;
            case 19:
                court.stats.cases.civil.len_gt12m = parseInt(row[2]);
                break;
        }
    });
}
