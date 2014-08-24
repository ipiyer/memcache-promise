/* jslint node:true */
"use strict";

var Q = require("q");

// methods on memcached

var methods = ["touch", "get", "gets", "getMulti", "set", "replace", "add", "cas", "append", "prepend", "incr", "decr", "del", "version", "flush", "stats", "settings", "slabs", "items", "cachedump", "end"];


module.exports = function(options) {
    // screwdriver doesn't have memcache so using stubs 
    if (process.env.NODE_ENV === "CI") {
        console.log("loading stub memcached");
        var Memcached = require("../test/unit/cache/stub_memcache");
        var memcached = new Memcached();
    } else {
        var Memcached = require("memcached");
        var memcached = new Memcached(process.env.manhattan_context__memcached_socket || "localhost:11211", options || {});
    }

    methods.forEach(function(method) {
        memcached[method] = Q.denodeify(memcached[method].bind(memcached));
    });

    // This really doesn't act like a mutex;
    // This is just additional function for cache warmup;
    memcached.lock = function(key) {
        return memcached.set(key, "LOCKED", 1 * 60);
    }

    memcached.gateKeeper = function(key, value, lifetime) {
        var deferred = Q.defer();
        memcached.get(key)
            .then(function(value) {
                // Nothing is set;
                // LOCK it 

                if (value === "LOCKED") {
                    // some other worker is working 
                    throw new Error("Worker has locked the cache");

                } else {
                    return memcached.lock(key);
                }
            }).then(function(val) {
                return memcached.set(key, value, lifetime).then(function() {
                    deferred.resolve(true);
                });
            })
            .fail(function(err) {
                return deferred.reject(new Error("Memcache update failed" + err));
            });


        return deferred.promise;
    }

    return memcached;
}