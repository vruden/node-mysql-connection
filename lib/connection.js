"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const mysql = require("mysql");
const _ = require("lodash");
class Connection extends events_1.EventEmitter {
    constructor(config) {
        super();
        if (config.customFormat) {
            config.connection.queryFormat = this.customFormat;
        }
        this.config = config;
        this.pool = mysql.createPool(config.connection);
        if (config.verbose) {
            console.log(`Initialize ${config.name} connection`);
        }
    }
    customFormat(query, values) {
        if (!values)
            return query;
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
    getConfig() {
        return this.config;
    }
    getPool() {
        return this.pool;
    }
    query(sql, values = undefined, callback) {
        if (_.isFunction(values)) {
            callback = values;
            values = undefined;
        }
        const query = this.pool.query(sql, values, function (err, results, fields) {
            if (err) {
                // err.queryString = query.sql;
            }
            callback && callback(err, results, fields, query.sql);
        });
        return query;
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map