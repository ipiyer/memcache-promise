/* jslint node:true */
"use strict";

var qMemcached = require("../"),
    Q = require("q"),
    expect = require("chai").expect;


describe('Memcached Promises', function() {
    var qmemcached = new qMemcached("localhost:11211");
    var methods = ["touch", "get", "gets", "getMulti", "set", "replace", "add", "cas", "append", "prepend", "incr", "decr", "del", "version", "flush", "stats", "settings", "slabs", "items", "cachedump", "end"];

    it("qMemcached methods should return promises", function(done) {
        methods.forEach(function(method) {
            expect(qmemcached[method]().constructor)
                .to.be.an.instanceOf(Q.constructor);
        });
        done();
    });
});