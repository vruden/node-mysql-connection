let MysqlConnection = require('../lib/index');
let async = require('async');
let assert = require('assert');

let mainDB = MysqlConnection.createConnection({
    name: 'main_db',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'node-test',
        debug: false
    },
    customFormat: true,
    verbose: true
});

let q = mainDB.query('DROP TABLE connection');
q.on('end', function () {
    console.log('drop')

    mainDB.query('CREATE TABLE connection (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT, note VARCHAR(255))', [], function (err, results, fields, sql) {
        console.log(arguments)

        let user = {name: 'Ivan', age: 12};

        mainDB.query('INSERT INTO connection SET :user', {user: user}, function (err, results, fields, sql) {
            console.log(arguments)
        });

        let users = [
            ['Alex', 34],
            ['Tom', 56],
        ];

        mainDB.query('INSERT INTO connection (name, age) VALUES :users', {users: users}, function (err, results, fields, sql) {
            console.log(arguments)
        });

        mainDB.query('INSERT INTO connection (name, age) VALUES (:name, :age)', {name: 'Mary', age: 21}, function (err, results, fields, sql) {
            console.log(arguments)
        });

        //  {ttl: 60},
        mainDB.query('SELECT * FROM ::name WHERE name = :tt AND age > :age', {name: 'user', age: 18, note: 'first user'}, function (err, results, fields, queryString) {
            console.log(results, queryString)

            // process.exit(0)
        });

    });

});






