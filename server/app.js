let express = require("express");
let cors = require("cors");
let app = express();
let mongoClient = require('mongodb').MongoClient
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
let connectionString = "mongodb://127.0.0.1:27017";
app.use(bodyParser.json())
app.use(cors());
app.get('/',(req,res)=>{
    res.send({
        "name":"dav college",
        "project":"ems"
    })
})
// let formData={
//     "username":"admin",
//     "password":"admin"
// }
//admin-login
app.post("/admin-login",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);
    res.send("data received");
}) 
//admin-dashboard api
app.post('/admin-dashboard',(req,res)=>{
     let department = req.body.department;
     let username = req.body.username;
     let password = req.body.password;
     let email = req.body.email;
      let data = {
        "department":department,
        "username":username,
        "password":password,
        "email":email,
     }
     mongoClient.connect(connectionString,(err,clientObject)=>{
        if(!err){
            let dbo = clientObject.db('DavEms');
            dbo.collection('admindashboard').insertOne(data,(err,result)=>{
                if(!err){
                    console.log("record inserted")
                }
            })
        
        }
    })
     res.send("data received successfully");
})
    app.get('/getdata',(req,res)=>{
        mongoClient.connect(connectionString,(err,clientObject)=>{
            if(!err){
                let dbo = clientObject.db('DavEms');
                dbo.collection('admindashboard').find({}).toArray((err,documents)=>{
                    if(!err){
                        res.send(documents);
                    }
                })
            }
        })
    })
app.listen(9090)
console.log("server started")