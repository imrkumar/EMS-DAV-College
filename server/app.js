let express = require("express");
let cors = require("cors");
let app = express();
let mongoClient = require("mongodb").MongoClient;
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
let connectionString = "mongodb://127.0.0.1:27017";
app.use(bodyParser.json());
app.use(cors());
//default
app.get("/", (req, res) => {
  res.send({
    name: "dav college",
    project: "ems",
  });
});

//admin-login 

app.post("/admin-login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo
        .collection("adminlogin")
        .find({})
        .toArray((err, documents) => {
          if (!err) {
            if (
              username === documents[0].Admin &&
              password === documents[0].Password
            ) {
              res.status(200);
              console.log("login success");
            } else {
              res.status(401);
              console.log("data does not match");
            }
          }
        });
    }
  });
  res.send("data received");
});

// AddDeptAdmin
app.post("/deptAdmin", (req, res) => {
  let department = req.body.department;
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let data = {
    department: department,
    username: username,
    password: password,
    email: email,
  };
  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo.collection("DeptAdmin").insertOne(data, (err, result) => {
        if (!err) {
          console.log("record inserted");
        }
      });
    }
  });
  res.send("data received successfully");
});

//admin dashboard
app.get("/admindashboard", (req, res) => {
  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo
        .collection("DeptAdmin")
        .find({})
        .toArray((err, documents) => {
          if (!err) {
            res.send(documents);
          }
        });
    }
  });
});

//department category route
app.get("/department", (req, res) => {
  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo
        .collection("department")
        .find({})
        .toArray((err, documents) => {
          if (!err) {
            res.send(documents);
          }
        });
    }
  });
});

//department admin login
app.post("/department/login", (req, res) => {
  let department = req.body.department;
  let username = req.body.username;
  let password = req.body.password;

  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo
        .collection("DeptAdmin")
        .find({ department: department })
        .toArray((err, documents) => {
          if (!err) {
            if (
              department == documents[0].department &&
              username == documents[0].username &&
              password == documents[0].password
            ) {
              res.status(200);
              console.log("login success");
            } else {
              res.status(401);
              console.log("login denied");
            }
          }
        });
    }
  });
  res.send("data received successfully");
});

// add department activity
app.post('/department/activity',(req,res)=>{
  // let date = new Date(req.body.eventDate); 
   let data = {
    "Date": req.body.eventDate,
    "eventNotice":req.body.eventNotice
   }
  console.log(data)
  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo.collection("DeptActivity").insertOne(data, (err, result) => {
        if (!err) {
          console.log("record inserted");
        }
      });
    }
  });
  
   res.send("data received successfully")
})
app.listen(9090);
console.log("server started");

