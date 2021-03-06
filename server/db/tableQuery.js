var MongoClient = require("mongodb").MongoClient;

var tableQuery = {
  url: "mongodb://localhost:27017/team_extra_data",
  all: function(result) {
    MongoClient.connect(this.url, function(err,db) {
      var tableCollection = db.collection("tableData");

      tableCollection.find().toArray(function (err, docs) {
        result(docs);
      })
    })
  }
}

module.exports = tableQuery;
