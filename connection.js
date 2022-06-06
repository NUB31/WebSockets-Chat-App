//imports
var mysql = require("mysql2");

//mysql config
var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Olhs1357@1",
  database: "messageApp",
});

//gets connection
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database connected successfully");
  connection.release();
});

//export connection to use in index.jsx
module.exports = pool;
