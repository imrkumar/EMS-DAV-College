let express = require("express");
let cors = require("cors");
let app = express();
let mongoClient = require('mongodb').MongoClient
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
let connectionString = "mongodb://127.0.0.1:27017";
app.use(bodyParser.json())
app.use(cors());
//default
app.get('/',(req,res)=>{
    res.send({
        "name":"dav college",
        "project":"ems"
    })
})

//admin-login

app.post("/admin-login",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
  
    mongoClient.connect(connectionString,(err,clientObject)=>{
        if(!err){
            let dbo = clientObject.db('DavEms');
            dbo.collection('adminlogin').find({}).toArray((err,documents)=>{
                if(!err){
                    if(username==documents[0].Admin && password==documents[0].Password){
                        res.status(200)
                      console.log("login success")  
                    }else{
                        console.log("data does not match");
                    }
                    
                }
            })
        }
    })
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

   //get data
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
    app.post('/adddepartment',function(req,res){
       let department= req.body.department;
       let data = {
        "department":department
       }
       console.log(department);
       mongoClient.connect(connectionString,(err,clientObject)=>{
        if(!err){
            let dbo = clientObject.db('DavEms');
            dbo.collection('department').insertOne(data,(err,result)=>{
                if(!err){
                    console.log("record inserted")
                }
            })
        
        }
    })
    res.send("data inserted");
    })
    // app.get('/admin/login',(req,res)=>{
        
    //         mongoClient.connect(connectionString,(err,clientObject)=>{
    //             if(!err){
    //                 let dbo = clientObject.db('DavEms');
    //                 dbo.collection('adminlogin').find({}).toArray((err,documents)=>{
    //                     if(!err){
    //                        res.send(documents)
    //                     }
    //                 })
    //             }
    //         })
    // })
app.listen(9090)
console.log("server started")