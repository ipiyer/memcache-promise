/*!
 * qMemcached - lib/qMemcached.js
 * Copyright(c) 2014 Prashanth <munichlinux@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var Q = require('q'),
    Memcached = require("memcached");

var methods = ["touch", "get", "gets", "getMulti", "set", "replace", "add", "cas", "append", "prepend", "incr", "decr", "del", "version", "flush", "stats", "settings", "slabs", "items", "cachedump", "end"];

module.exports = function(server, options) {

    var memcached = new Memcached(server, options);

    // override all the methods with promised methods;

    methods.forEach(function(method) {
        memcached[method] = Q.denodeify(memcached[method].bind(memcached));
    });

    return memcached;
}