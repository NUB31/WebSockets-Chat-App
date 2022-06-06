// imports
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
const fileupload = require("express-fileupload");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Middleware that gives you access to the request body object
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: false,
    parameterLimit: 1000000,
  })
);
// Middleware that makes the upload folder available under the upload endpoint example: http:localhost:12000/upload/default.svg
app.use("/upload", express.static("upload"));
// Middleware that makes the build folder available
app.use(express.static(path.join(__dirname, "build")));
// Middleware that gives access to req.cookie object
app.use(cookieParser());
// Middleware that allows us to use the json format
app.use(express.json({ limit: "100mb" }));
// Middleware that allows us to upload files to the server
app.use(fileupload());

// Define the server port
const port = 12000;

// Creates a web server
const server = http.createServer(app);
// Creates a socket server and connects it to the web server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Import the SQL connection
const con = require("./connection.js");

// When a person connects to the server
io.on("connection", (socket) => {
  // When the server recieves a socket with the name "chat message"
  socket.on("chat message", ({ msg, userid, userto }) => {
    // Insert the message into the DB
    con.query(
      "INSERT INTO message (userid, messageto, messagecontent ) VALUES (?, ?, ?)",
      [userid, userto, msg],
      (err, fields) => {
        if (err) throw err;
        console.log(
          `inserted ${fields.affectedRows} message with id: ${fields.insertId}`
        );
        // Send message to all people including me
        io.emit("newMessage", {
          from: userid,
          to: userto,
          msg: msg,
          id: fields.insertId,
        });
      }
    );
  });
  // When the server recieves a socket with the name "delete message"
  socket.on("delete message", ({ msgId }) => {
    con.query("DELETE FROM message WHERE id = ?", [msgId], (err, fields) => {
      if (err) throw err;
      console.log(`deleted ${fields.affectedRows} message with id: ${msgId}`);
      // Send delete message to all people including me
      io.emit("deleteMessage", {
        msgId: msgId,
      });
    });
  });
  // When the server recieves a socket with the name "edit message"
  socket.on("edit message", ({ msgId, messageContent }) => {
    con.query(
      "UPDATE message SET messagecontent = ? WHERE id = ?",
      [messageContent, msgId],
      (err) => {
        if (err) throw err;
        // Send edit to all people except me (i already have the edit)
        socket.broadcast.emit("editMessage", {
          msgId: msgId,
          messageContent: messageContent,
        });
      }
    );
  });
  // When the server recieves a socket with the name "setOnlineStatus"
  socket.on("setOnlineStatus", ({ status, id }) => {
    // Set the persons status to online in db
    con.query("UPDATE user SET onlinestatus = ?, socketid = ? WHERE id = ?", [
      status,
      socket.id,
      id,
    ]);
    // Send the status to all people except me
    socket.broadcast.emit("setOnlineClientStatus", {
      id: id,
      status: status,
    });
  });
  // When the person leaves the website (log out, closes tab, shuts off the pc etc.)
  socket.on("disconnect", () => {
    // Set the onlinestatus to offline
    con.query("UPDATE user SET onlinestatus = 2 WHERE socketid = ?", [
      socket.id,
    ]);
    // Send that the person is offline to everyone except me
    socket.broadcast.emit("setOnlineClientStatus", { id: 1, status: 2 });
  });
});

app.post("/getMessages", authenticateToken, (req, res) => {
  // Get all messages that i sent, or i recieved
  con.query(
    "SELECT u.username, m.messagecontent, m.userid, m.messageto, m.id, u.profilepicture FROM message m, user u WHERE (m.userid = ? AND m.messageto = ? AND m.userid = u.id) OR (m.userid = ? AND m.messageto = ? AND m.userid = u.id);",
    [req.body.userId, req.body.userFrom, req.body.userFrom, req.body.userId],
    (err, rows) => {
      if (err) throw err;
      // Send the messages back
      res.json(rows);
    }
  );
});

app.post("/getFriends", authenticateToken, (req, res) => {
  // Get all friends that i added, or friend added
  con.query(
    "SELECT u.username, u.id, u.onlinestatus, u.profilepicture FROM user u INNER JOIN (SELECT USER1, user2 FROM friend WHERE USER1 = ? UNION SELECT USER2, user1 FROM friend WHERE user2 = ?) f ON f.user2 = u.id;",
    [req.user.id, req.user.id],
    (err, rows) => {
      if (err) throw err;
      // Send the users back
      res.json(rows);
    }
  );
});

app.post("/addFriend", authenticateToken, (req, res) => {
  // Add he friend to DB
  con.query(
    "INSERT INTO friend (user1, user2) VALUES (?, ?)",
    [req.body.friendID, req.body.myId],
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

// Called everytime you write in the search field
app.post("/searchUsers", (req, res) => {
  // Search for people with wildcards on the side example: "rse" will return Arseni
  con.query(
    `SELECT username, id, profilepicture FROM user WHERE username LIKE ${con.escape(
      "%" + req.body.username + "%"
    )}`,
    (err, rows) => {
      if (err) throw err;
      // Send the users back
      res.json(rows);
    }
  );
});

app.get("/getUserData", authenticateToken, (req, res) => {
  // get my own userdata
  con.query(
    "SELECT * FROM user WHERE username = ? LIMIT 1",
    [req.user.name],
    (err, rows) => {
      if (err) throw err;
      // Send back userdata
      res.json(rows);
    }
  );
});

// upload endpoint
app.post("/upload", authenticateToken, (req, res) => {
  let fileName = uuidv4() + req.files.userpic.name;
  req.files.userpic.mv("./upload/" + fileName);
  // Send back successmessage and link to the image
  res.json({
    status: "success",
    msg: "File uploaded successfully",
    location: "http://localhost:12000/upload/" + fileName,
  });
});

app.post("/login", (req, res) => {
  // Find the user with entered username
  con.query(
    `SELECT * FROM user WHERE username = ? OR email = ? LIMIT 1`,
    [req.body.username, req.body.username],
    (err, rows) => {
      if (err) throw err;
      if (rows.length == 0) {
        // If no user exists, send back "User not found"
        return res.status(403).json({ status: "error", msg: "User not found" });
      }
      // If user exists, check if passwords match
      bcrypt.compare(req.body.password, rows[0].password, (err, result) => {
        if (err) throw err;
        if (result == true) {
          const username = req.body.username;
          const user = { name: username, id: rows[0].id };
          // Make a cookie that automatically logs you in
          const accessToken = jwt.sign(user, "rcomFbeJB7CpTXqrcbx1");
          // Send the cookie
          res.cookie("jwt", accessToken);
          return res.json({ status: "success" });
        }
        // If passwords dont match, send error
        return res
          .status(403)
          .json({ status: "error", msg: "Password is wrong" });
      });
    }
  );
});

app.get("/logout", (req, res) => {
  // Remove the autologin cookie
  res.clearCookie("jwt");
  res.json({ status: "success" });
});

app.post("/newUser", (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 10);
  // Make new user with the hasshed password
  con.query(
    "INSERT INTO user (fullname, username, password, phone, email) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.fullname,
      req.body.username,
      hashedPassword,
      req.body.phone,
      req.body.email,
    ],
    (err) => {
      if (err) throw err;
      // Send response, which will redirect user on the frontend
      return res.json({ status: "success" });
    }
  );
});

app.post("/updateUser", (req, res) => {
  if (req.body.password)
    var hashedPassword = bcrypt.hashSync(req.body.password, 10);
  con.query(
    `UPDATE user SET ${
      req.body.username ? "username = '" + req.body.username + "'" : ""
    } ${
      hashedPassword ? "password = '" + hashedPassword + "'" : ""
    } WHERE username = "${req.body.oldusername}"`,
    (err) => {
      if (err) throw err;
      return res.json({ status: "success" });
    }
  );
});

function authenticateToken(req, res, next) {
  // gets jwt cookie from request
  const token = req.cookies.jwt;
  // if there is no token, redirect to login
  if (token === null)
    return res.status(403).json({ status: "redirect", url: "/login" });
  // else check if token is valid
  jwt.verify(token, "rcomFbeJB7CpTXqrcbx1", (err, user) => {
    // if token is not valid, return to login
    if (err) return res.status(403).json({ status: "redirect", url: "/login" });
    // set the username as req.user
    req.user = user;
    // continue request
    next();
  });
}

// Start the server
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
