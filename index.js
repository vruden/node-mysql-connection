'use strict';

var Connection = require('./lib/connection');

var connections = {};

function createConnection(config) {
    if (!/^\w+$/.test(config.name)) {
        throw new Error('The name should contain letters, digits and/or underscore characters only.');
    }

    if (connections[config.name]) {
        return connections[config.name];
    }

    return connections[config.name] = new Connection(config);
}

function getConnection(name) {
    if (!connections[name]) {
        throw new Error('Connection `' + name + '` is not initialized.');
    }

    return connections[name];
}

exports.createConnection = createConnection;
exports.getConnection = getConnection;