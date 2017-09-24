const MysqlConnection = require('../lib/index');
const async = require('async');
const assert = require('assert');
const mysql = require('mysql');

const mainDbConfiguration = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'node-test',
    debug: false
};

let customDB = MysqlConnection.createConnection({
    name: 'custom_db',
    connection: mainDbConfiguration,
    customFormat: true,
    verbose: true
});

let regularDb = MysqlConnection.createConnection({
    name: 'regular_db',
    connection: mainDbConfiguration,
    customFormat: false
});

describe('connection', function () {
    describe('get connection', function () {
        it('should return existed connection', function (done) {
            let connection = MysqlConnection.getConnection('regular_db');

            // assert.equal(mainDbConfiguration, connection.getConfig(), 'Object does not contain a property named id');
            // assert.equal(mainDbConfiguration, connection.getConfig(), 'Object does not contain a property named id');
            assert.equal(mainDbConfiguration, connection.getConfig(), 'Object does not contain a property named id');


            done();
        });
    });
});