let express = require("express");
let cors = require("cors");
let app = express();
let fs = require('fs');
let multer = require('multer');
let mongoClient = require("mongodb").MongoClient;
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
let connectionString = "mongodb://127.0.0.1:27017";
let mongoose = require("mongoose");
let path = require('path');
const { data } = require("jquery");
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
  res.send({
    "about":"This is Event management of DAV College."
  })
})

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/backend/images')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })
// const upload = multer({ dest: '../public/backend/images' }) 


// add department activity
app.post('/department/activity',upload.fields([
  { name: 'eventNotice', maxCount: 1 },
  { name: 'eventBanner', maxCount: 1 },
  { name: 'attendance', maxCount: 1 },
  { name: 'eventPic', maxCount: 10 },
  { name: 'mediaCoverage', maxCount: 10 },
]), (req,res)=>{
     let data ={
        eventDate: req.body.eventDate,
         eventNotice:req.files['eventNotice'][0].path,
        eventBanner:req.files['eventBanner'][0].path,
        eventName:req.body.eventName,
        resourcePerson:req.body.resourcePerson,
        briefIntro: req.body.briefIntro,
        
        eventReport:req.body.eventReport, 
        attendance:req.files['attendance'][0].path,
        eventPic:req.files['eventPic'].map(file=>file.path),
        mediaCoverage:req.files['mediaCoverage'].map(file=>file.path)
       
     }
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
   console.log(req.body, req.file)
    
   res.send("data received successfully") 
})
app.listen(9090);
console.log("server started");

/**
 * consume api data 
 */

app.get("/getEventData", (req, res) => {
  mongoClient.connect(connectionString, (err, clientObject) => {
    if (!err) {
      let dbo = clientObject.db("DavEms");
      dbo
        .collection("DeptActivity")
        .find({})
        .toArray((err, documents) => {
          if (!err) {
            res.send(documents); 
          }
        });   
    }
  });
});
