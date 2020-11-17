var MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017";

exports.saveCV=(req,res)=>{
    let CV=req.query.data;
    CV=JSON.parse(CV);
    console.log("database get "+CV);
    MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, function (err, db) {
            if(err) throw err;
            console.log("数据库已连接");
            let dbo = db.db("hrsystem");
            dbo.collection("CV").insertOne(CV,function(err,rea){
                if(err) throw err;
                console.log("简历存储成功");
                
                res.json({
                    "message": "存储成功！"
                });
                db.close();
            })
            
    })
}

exports.getCV=(req,res)=>{
    // console.log("到后台啦！");
    let name = JSON.parse(req.query.data).name;
    
    MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, function (err, db) {
                if(err) throw err;
                // console.log("简历数据已连接！");
                let dbo=db.db("hrsystem");
                dbo.collection("CV").aggregate({
                        $match: {
                            "CV.name": "张三"
                        }
                    }).toArray((err, docs) => {
                    // console.log(docs);
                    if(err) console.log(err);
                    let CV=docs[0].CV;
                    // console.log(CV);
                    res.send({
                        "CV":CV
                    })
                    setTimeout(() => {
                        db.close();
                    }, 3000);
                })
            })
        }

exports.getattendencedata=(req,res)=>{
    //  console.log("到后台啦！");
     let id = JSON.parse(req.query.data).id;
     MongoClient.connect(url, {
                 useNewUrlParser: true,
                 useUnifiedTopology: true
             }, function (err, db) {
                 if (err) throw err;
                //  console.log("打卡数据已连接！");
                 let dbo = db.db("hrsystem");
                 let today=new Date();//今日时间
                 let days=0;//需要取的数据天数
                 let endscds=0;//第一天的凌晨时间毫秒数
                 let daylength=24*3600*1000;//一天的毫秒数
                 let startscds = today.toLocaleDateString();//今天的起始秒数（今日凌晨0:00时的秒数）
                 startscds=Date.parse(startscds);
                 days=today.getDate();
                 if(days==1){
                     endscds=startscds;
                 }else{
                     endscds=startscds-(days-1)*daylength;
                 }
                 
                 dbo.collection("workattendence").find({
                         "id": id,
                         "startime": {
                             $gt: endscds
                         }
                     }).toArray((err, docs) => {
                        // console.log(docs);
                        res.send({
                        data:docs
                        })
                        // console.log("打卡数据传输完成");
                        setTimeout(() => {
                            db.close();
                        }, 3000);
                     })
                })
}

exports.showprogress=(req,res)=>{
    // console.log("到后台啦！");
    let id = JSON.parse(req.query.data).id;
    let date = JSON.parse(req.query.data).date;
    date=new Date(date);
    let day=date.getDay();
    let oldprogress=[],nowprogress=[];
    if(day==0){
        day=6;
    }else{
        day=day-1;
    }
    let startDayTime=date-day*24*3600*1000;
    // console.log(name);
    MongoClient.connect(url, {              
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        if (err) throw err;
        // console.log("进度数据库已连接！");
        let dbo = db.db("hrsystem");
        
        dbo.collection("progress").find({           
            "id": id,
            "date": {
                $gt: startDayTime
            }
        }).sort({ //按时间升序排序
            "_id": 1
        }).toArray((err, docs) => {
            // console.log("获取到的进度是：");
            // console.log(docs[0].date);
            
            if (err) console.log(err);
            if (docs.length == 0) {
                res.send({
                    "oldprogress": [0],
                    "nowprogress": []
                })
            }else{
                let progressPromise2=new Promise((resolve,rel)=>{
                    let j = 0;
                    let progressData=docs;
                    // console.log("progressData:");
                    // console.log(progressData);
                    // console.log(progressData.length);
                    for(let i=0;i<7;i++){       //精确匹配周几
                        // console.log(docs);
                        ((i)=>{
                            // console.log("j");
                            // console.log(j);
                            if (j < progressData.length) {
                                let progressDate = progressData[j].date;
                                let progressDay=(new Date(progressDate)).getDay();
                                if(progressDay==0){
                                    progressDay=7
                                }
                                // console.log("progressDay");
                                // console.log(progressDay);
                                if(i==progressDay-1){   //是否是合得上星期几
                                    let pushOldProgress;
                                    if(j==0){
                                        pushOldProgress = progressData[j].oldprogress
                                        oldprogress.push(...pushOldProgress);
                                    } else {
                                        pushOldProgress = progressData[j].oldprogress.slice(-1) * 1;
                                        oldprogress.push(pushOldProgress);
                                    }
                                    nowprogress.push(...progressData[j].nowprogress);
                                    
                                    // console.log("oldprogress in showChart3");
                                    // console.log(oldprogress);
                                    j++;//合得上则数组下标+1
                                }else{
                                    nowprogress.push(0);    
                                    if(oldprogress.length==0){ //如果之前没有记录，则添加一个0
                                        oldprogress=[0];
                                    }else{
                                        oldprogress.push(oldprogress[oldprogress.length - 1])
                                    }
                                    
                                    // console.log("progress in else:");
                                    // console.log(nowprogress);
                                }
                            }
                            
                        })(i)
                    }
                    resolve("进度传输完成");
                })
                progressPromise2.then((result)=>{
                    // console.log("进度传输完成")
                    // console.log("oldpropress: ");
                    // console.log(oldprogress);
                    // console.log("nowprogress: "+nowprogress);
                    res.send({
                        "oldprogress": oldprogress,
                        "nowprogress": nowprogress
                    })
                })
                
            }
            
            setTimeout(() => {
                db.close();
            }, 3000);
        })
        
    })
}

exports.saveprogress=(req,res)=>{
    console.log("存储进度");
    let progress = req.query.data;
    progress=JSON.parse(progress);
    // console.log(progress);
    let nowprogress=progress.nowprogress;
    let oldprogress=progress.oldprogress;
    console.log(oldprogress);
    if(oldprogress[0]==null){
        oldprogress=[0]
    }
    let id=progress.id;
    let date=Date.parse(new Date(progress.date).toLocaleDateString());
    let progressPromise=new Promise((res,rel)=>{
        // console.log("检验重复登记");
        MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("hrsystem");
                    dbo.collection("progress").find({"id":id,"date":date}).toArray((err,docs)=>{
                        // console.log("检验结果");
                        // console.log(docs);
                        if(err) console.log(err);
                        if(docs.length>0){
                            console.log(oldprogress);
                            oldprogress[oldprogress.length - 2] = oldprogress[oldprogress.length - 1]
                            oldprogress.pop();
                            console.log(oldprogress);
                            nowprogress[nowprogress.length-2]+=nowprogress[nowprogress.length-1];
                            nowprogress.pop();
                        }
                        res("结束");
                        db.close();
                    })
                    
                })
    })
    progressPromise.then((result)=>{
        nowprogress=nowprogress.slice(-1);
        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {
            if (err) throw err;
            console.log("数据已连接！");
            let dbo = db.db("hrsystem");
            dbo.collection("progress").updateOne({
                "id": id,
                "date": date
            }, {
                $set: {
                    "id": id,
                    "nowprogress": nowprogress,
                    "oldprogress": oldprogress,
                    "date": date
                }
            }, {
                upsert: true
            }).then(() => {
                console.log("数据库存储完毕");
                res.send({
                    "msg": "数据库已更新完毕"
                })
            });
            setTimeout(() => {
                db.close();
            }, 3000);
        })
    })


    
    
}

exports.setworkattendence=(req,res)=>{
    let workattendence = JSON.parse(req.query.data);
    let id=workattendence.id;//员工id
    let date=workattendence.date;//打卡日期
    let time=workattendence.time;//打卡准确毫秒数
    let num=0;
    let promise = new Promise((resolve, reject) =>{
        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {
            if(err) throw err;
            dbo = db.db("hrsystem");
            dbo.collection("workattendence").find({
                id: id,
                date: date
            }).toArray((err, docs) => {
                if (err) throw err;
                if (docs.length == 0) {
                    resolve(1);
                    console.log(111);
                    db.close();
                } else {
                    resolve(2);
                    db.close();
                }
            });
        })
    });
    promise.then((result)=>{
        num=result;
        console.log(num);
         if (num == 1) {
             MongoClient.connect(url, {
                 useNewUrlParser: true,
                 useUnifiedTopology: true
             }, function (err, db) {
                 if (err) throw err;
                 dbo = db.db("hrsystem");
                 dbo.collection("workattendence")
                     .insertOne({
                         "id": id,
                         "startime": time,
                         "date": date,
                         "workok": num,
                         "endtime": time,
                         "addwork": 0,
                         "worktime":0
                     });
                //  console.log("打卡数据已存入");
             })
         }else{
             if(num==2){

             }
             let workTime=0;
             let promise1=new Promise((res,rej)=>{
                 MongoClient.connect(url, {
                     useNewUrlParser: true,
                     useUnifiedTopology: true
                 }, function (err, db) {
                     if (err) throw err;
                     dbo = db.db("hrsystem");
                     let startime=dbo.collection("workattendence")
                         .findOne({
                             "id": id,
                             "date": date
                         });
                         res(startime);
                         setTimeout(() => {
                             db.close();
                         }, 300);
                     
                 })
             });
             promise1.then((result)=>{
                 console.log(result);
                workTime=time-result.startime;
                MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }, function (err, db) {
                    if (err) throw err;
                    dbo = db.db("hrsystem");
                    dbo.collection("workattendence")
                        .updateOne({
                            "id": id,
                            "date": date
                        }, {
                            $set: {
                                "endtime": time,
                                "workok": num,
                                "worktime": workTime,
                                "addwork": 0
                            }
                        }, {
                            upsert: true
                        });
                    // console.log("打卡数据已存入");
                    setTimeout(() => {
                        db.close();
                    }, 300);
                })
             })
             
         }
    }).then(()=>{
        
        res.send("打卡成功！");
    })
    
   
}
    

