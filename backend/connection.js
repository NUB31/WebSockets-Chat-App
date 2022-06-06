// imports
var mysql = require("mysql2");

// mysql config
var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Qwerty12345@1",
  database: "messageApp",
});

// attmpts to connect to database, if error, throws error
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database connected successfully");
  connection.release();
});

// export connection to use in index.jsx
module.exports = pool;
