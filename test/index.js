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

let db =  mysql.createPool(mainDbConfiguration);

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

describe('query', function () {
    describe('select', function () {
        before('Insert test data', function (done) {
            async.series(
                [
                    function (callback) {
                        db.query('CREATE TABLE IF NOT EXISTS connection (id INT AUTO_INCREMENT PRIMARY KEY, server VARCHAR(255), connection_number INT, region VARCHAR(255))', callback)
                    },
                    function (callback) {
                        db.query('DELETE FROM connection', callback);
                    },
                    function (callback) {
                        let data = [
                            ['first', 23, 'SFO'],
                            ['second', 43, 'SAC'],
                            ['third', 21, 'SFO'],
                            ['fourth', 3, 'SFO']
                        ];
                        db.query('INSERT INTO connection (server, connection_number, region) VALUES ?', [data], callback);
                    }
                ],
                done
            );
        });

        it('should return correct data', function (done) {
            customDB.query(
                'SELECT * FROM connection WHERE region = :region AND connection_number > :connectionNumber',
                {region: 'SFO', connectionNumber: 15},
                function (err, rows, fields, sql) {
                    if (err) {
                        return done(err);
                    }

                    assert.equal(2, rows.length, 'Wrong array length');
                    assert.ok(rows[0].hasOwnProperty('id'), 'Object does not contain a property named id');
                    assert.ok(rows[0].hasOwnProperty('server'), 'Object does not contain a property named name');
                    assert.ok(rows[0].hasOwnProperty('connection_number'), 'Object does not contain a property named title');
                    assert.ok(rows[0].hasOwnProperty('region'), 'Object does not contain a property named title');

                    done();
                }
            );
        });
    });
});

// let q = mainDB.query('DROP TABLE connection');
// q.on('end', function () {
//     console.log('drop')
//
//     mainDB.query('CREATE TABLE connection (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT, note VARCHAR(255))', [], function (err, results, fields, sql) {
//         console.log(arguments)
//
//         let user = {name: 'Ivan', age: 12};
//
//         mainDB.query('INSERT INTO connection SET :user', {user: user}, function (err, results, fields, sql) {
//             console.log(arguments)
//         });
//
//         let users = [
//             ['Alex', 34],
//             ['Tom', 56],
//         ];
//
//         mainDB.query('INSERT INTO connection (name, age) VALUES :users', {users: users}, function (err, results, fields, sql) {
//             console.log(arguments)
//         });
//
//         mainDB.query('INSERT INTO connection (name, age) VALUES (:name, :age)', {name: 'Mary', age: 21}, function (err, results, fields, sql) {
//             console.log(arguments)
//         });
//
//         //  {ttl: 60},
//         mainDB.query('SELECT * FROM ::name WHERE name = :tt AND age > :age', {name: 'user', age: 18, note: 'first user'}, function (err, results, fields, queryString) {
//             console.log(results, queryString)
//
//             // process.exit(0)
//         });
//
//     });
//
// });






