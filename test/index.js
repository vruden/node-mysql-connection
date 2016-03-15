var q = require('../index');

var main_db = q.createConnection({
    name: 'main_db',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'node-migrate'
    },
    customFormat: true,
    TTL: 0, // Time To Live for a cache key in seconds (0 = infinite)
    verbose: true, // Do you want console.log's about what the program is doing?
    caching: true // Do you want to use SELECT SQL caching?
});


main_db.query('select * from ::name where name = :tt ', {name: 'user', tt: 'Ivan'}, {ttl: 60}, function (err, result, fields, queryString) {
    console.log(result, queryString)

    process.exit(0)
})