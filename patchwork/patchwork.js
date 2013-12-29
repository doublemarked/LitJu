"use strict";

var pwt = require('./patchwork-tools');

var context = {
    courts: {},
    judges: {},
    assignments: {}
};

// MAPPING RULES: https://docs.google.com/a/doublemarked.com/spreadsheet/ccc?key=0Ao7Okl15ohMddHREdy1zYVpJcTZMLXRVUDdZeGlSRXc&usp=sharing

pwt.seriesExec(context, [
        require("./patch-0101").exec,
        require("./patch-0102").exec,
        require("./patch-0103").exec,
        require("./patch-0104").exec,
        require("./patch-0105").exec,
        require("./patch-0201").exec,
        require("./patch-0301").exec,
        pwt.aggregate,
        pwt.dump
    ]);

