import {Db} from "../src/db/Db";

const prepare = require('mocha-prepare');

prepare(function (done: () => void) {
    // called before loading of test cases
    Db.create().then(() => {
        done();
    });

});