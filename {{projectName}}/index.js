const couchbase = require('couchbase').Mock;

module.exports.handler = function(event, context, callback) {
    var cluster = new couchbase.Cluster();
    var bucket = cluster.openBucket();

    bucket.upsert('testdoc', {hello:'world'}, function(err, result) {
        if (err) throw err;
        bucket.get('testdoc', function(err, result) {
            if (err) throw err;
            callback(null, result.value)
        });
    });
}