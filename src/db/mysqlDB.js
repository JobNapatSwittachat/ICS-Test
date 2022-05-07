const mysql = require("mysql");
const config = require("../config");

const db = mysql.createConnection(config.database);

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + db.threadId);
});

// db.end()
module.exports = db;
