'use strict';

var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var _ = require('lodash');

function customFormat (query, values) {
    if (!values) return query;
    return query.replace(/\:\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escapeId(values[key]);
        }
        return txt;
    }.bind(this)).replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
}

function Connection(config) {
    EventEmitter.call(this);

    if (config.customFormat) {
        config.connection.queryFormat = _.isFunction(config.customFormat) ? config.customFormat : customFormat;
    }

    this.pool = mysql.createPool(config.connection);

    this.getConfig = function () {
        return config;
    };



    if (config.verbose) {
        console.log('Initialize', config.name, 'connection');
    }

    return this;
}

Connection.prototype.query = function (sqlString, queryParams, cacheParams, callback) {
    if (_.isFunction(queryParams)) {
        callback = queryParams;
        queryParams = null;
        cacheParams = null;
    } else if (_.isFunction(cacheParams)) {
        callback = cacheParams;
        cacheParams = null;
    }

    var query = this.pool.query(sqlString, queryParams, function (err, results, fields) {
        if (err) {
            err.queryString = query.sql;
        }
        callback(err, results, fields, query.sql);
    });
};

//flushAll();

module.exports = Connection;