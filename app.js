const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))
app.set('views','./src/views/')
app.set('view engine','ejs')
let port = 7833;
app.use(bodyParser.json())
const users=[
    {
    username:"admin",
    userpwd :"admin"
    }
]
//default path
app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/admin',(req,res)=>{
    res.render('admin_login')
})
//admin login path
app.post('/adminLogin',(req,res)=>{
    const {username,userpwd}=req.body;
    if(users.username===username&&users.userpwd===userpwd){
        const redirectURL ='/';
        res.status(200).json({ success: true, user, redirectURL });
       
    }else{
        res.status(401).json({ message: 'Invalid username or password' });
    }
    }
)

app.listen(port,(err)=>{
    if(err) console.log(err);
    else{
        console.log(`Server is running on port ${port}`);
    }
    })