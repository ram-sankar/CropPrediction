const express = require('express');
const app = express();
const url_redirect = require('url');
var calculate = require('./calc');
var User = require('../models/user');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_URL;

app.post('/crop', (req,res) =>{   
  MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("ayini");
          dbo.collection("crop").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.render('all-crop',{
                crop:result
            });
            
            db.close();
          });
        });    
});

app.post('/result', (req,res) =>{   
  MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("ayini");
      
            var mysort = { crop_mark: -1 };  
            dbo.collection("marks").find({}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
              console.log(result);
            res.render('result',{
                crop:result
            });
            
            db.close();
          });
        });    
});



//http://localhost:3000/data?&ph=2&n=3&p=4&k=0&ca=3&mg=3

app.get('/data',(req,res,next) =>{
  var ph = req.query.ph;
  var n = req.query.n;
  var p = req.query.p;
  var k = req.query.k;
  var ca = req.query.ca;
  var mg = req.query.mg;
  var arr_ph = new Array();
  var arr_n = new Array();
  var arr_p = new Array();
  var arr_k = new Array();
  var arr_ca = new Array();
  var arr_mg = new Array();
  var arr_crop = new Array();
  var arr_mark = new Array();    
  var i;var j; var x,temp_mark,t_mark,temp=0;
    j=0;
    
  MongoClient.connect(url, function(err, db) {
      
      if (err) throw err;
          var dbo = db.db("ayini");
      
      
      var myquery = {};
  dbo.collection("marks").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
      
      console.log(obj.result.n + " document(s) deleted");
  });
          
          dbo.collection("crop").find({}).toArray(function(err, result) {
            if (err) throw err;
              for(i in result)
                {   
                    db_ph = result[i].ph;
                    db_n = result[i].n;
                    db_p = result[i].p;
                    db_k = result[i].k;
                    db_ca = result[i].ca;
                    db_mg = result[i].mg;
                    db_name = result[i].crop;
                    
                    
                    ph_max=result[i].ph_max;
                    ph_min=result[i].ph_min;
                    ph_avg=(ph_max+ph_min)/2;
                 
                    ph_mark = calculate.calc_ph(ph_avg,ph,ph_max,ph_min);
                    n_mark = calculate.calc_n(db_n,n);
                    p_mark = calculate.calc_p(db_p,p);
                    k_mark = calculate.calc_k(db_k,k);
                    ca_mark = calculate.calc_ca(db_ca,ca);
                    mg_mark = calculate.calc_mg(db_mg,mg);
                    ph_mark = Number((ph_mark).toFixed(1));
                    
                    
                    arr_ph[i] = ph_mark;
                    arr_n[i] = n_mark;
                    arr_p[i] = p_mark;
                    arr_k[i] = k_mark;
                    arr_ca[i] = ca_mark;
                    arr_mg[i] = mg_mark;
                    arr_crop[i] = db_name;
                    
                    t_mark = ph_mark+n_mark+p_mark+k_mark+ca_mark+mg_mark;
                    t_mark = Number((t_mark).toFixed(1));
                    arr_mark[i]=t_mark;
                    temp++;
                    if(t_mark>0)
                    {
                        var newmark = new User({crop_mark:t_mark, crop_name: db_name, crop_id:temp});
                        User.create(newmark, function(err, newUser) {
                        if(err) return next(err);                           
                        });
                    }
                    
                }
              
//        res.render('predict',{
//                title:"predict",
//                arr_mark:arr_mark,
//                arr_ph:arr_ph,
//                arr_n:arr_n,
//                arr_p:arr_p,
//                arr_k:arr_k,
//                arr_ca:arr_ca,
//                arr_mg:arr_mg,
//                arr_crop:arr_crop
//            });
            db.close();
          });
        }); 
  
              res.send("done");
        
    
});


app.get('/predict', (req,res) =>{   
  MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("ayini");
      
            
            dbo.collection("predict").find({}).toArray(function(err, result) {
            if (err) throw err;
              console.log(result);
            res.render('predict',{
                predict:result
            });
            
            db.close();
          });
        });    
});


module.exports = app;








//db.crop.insert([{crop:"Peanut", ph_min:4.5, ph_max:5, n:200, p:18, k:50, ca:5, mg:12},{crop:"Potato", ph_min:4.5, ph_max:6, n:170, p:22, k:220, ca:30, mg:28},{crop:"Garlic", ph_min:5.5, ph_max:7.5, n:142, p:24, k:105, ca:57, mg:9},{crop:"Onion", ph_min:6, ph_max:7, n:155, p:60, k:132, ca:52, mg:20},{crop:"Orange", ph_min:5.5, ph_max:6.5, n:135, p:16, k:110, ca:90, mg:12},{crop:"Peas", ph_min:5.8, ph_max:7, n:125, p:20, k:105, ca:45, mg:37},{crop:"Rice", ph_min:5.5, ph_max:6.5, n:217, p:68, k:256, ca:27, mg:23},{crop:"Tomato", ph_min:5.5, ph_max:7.5, n:136, p:24, k:192, ca:240, mg:22},{crop:"Wheat", ph_min:5.2, ph_max:6.2, n:125, p:24, k:35, ca:3.5, mg:10}])
     