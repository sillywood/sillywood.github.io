const express=require('express');
const app=express();
const port=8000;

let DB =require("./api/db.js");

const cors=require('cors');
app.use(cors());

app.use("../public",express.static('public'));

app.get("/",(req,res)=>{
    res.send({
        p:"go"
    });
})

app.post("/setCV",DB.saveCV);

app.get("/getCV", DB.getCV);

app.get("/showprogress",DB.showprogress);

app.get("/saveprogress",DB.saveprogress);

app.get("/getattendencedata", DB.getattendencedata);

app.get("/workattendence", DB.setworkattendence);

app.listen(port,function(){
    console.log("server has been success run in "+port);
})

