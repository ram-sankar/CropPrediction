const express = require('express');
const app = express();
const url_redirect = require('url');
var calculate = require('./calc');
var db_access = require('../models/schema');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_URL;

/*
- crop: to show all available crop with their nutrient value
- result: to show the predicted crop
- data: to calculate the mark for the given data
- predict: to show prediction for each crop
*/

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


app.get('/crop', (req,res) =>{   
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
    
  var i,j,x,temp_mark,t_mark,temp=0;
    j=0;
    
  MongoClient.connect(url, function(err, db) {
      
      if (err) throw err;
      var dbo = db.db("ayini");
      
          //delete the previous rows
          var myquery = {};
          dbo.collection("marks").deleteMany(myquery, function(err, obj) {
          if (err) throw err;      
          console.log(obj.result.n + " document(s) deleted");
          });
      
          dbo.collection("predicts").deleteMany({}, function(err, obj) {
          if (err) throw err; 
          });
        
      
      dbo.collection("crop").find({}).toArray(function(err, result) {
      if (err) throw err;
          
      for(i in result)
          {   
              db_ph = result[i].ph;           db_n = result[i].n;
              db_p = result[i].p;             db_k = result[i].k;
              db_ca = result[i].ca;           db_mg = result[i].mg;
              db_name = result[i].crop;
                                        
              ph_max=result[i].ph_max;        ph_min=result[i].ph_min;
              ph_avg=(ph_max+ph_min)/2;                                    
    
              temp++;
              t_mark = calculate.calc_total(db_ph,ph,ph_max,ph_min,db_n,n,db_p,p,db_k,k,db_ca,ca,db_mg,mg,db_name,temp);
    
              if(t_mark>0)
              {
                  var newmark = new db_access.mark({crop_mark:t_mark, crop_name: db_name, crop_id:temp});
                  db_access.mark.create(newmark, function(err, newmark) {
                  if(err) return next(err);                           
                  });
              }
                    
          }
              
        db.close();
      });
  }); 
    
  res.send("done");
});


app.get('/predict', (req,res) =>{   
  MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("ayini");                 
          dbo.collection("predicts").find({}).toArray(function(err, result) {
              if (err) throw err;
              res.render('predict',{
                  predict:result
              });

              db.close();
              });
  });    
});


module.exports = app;

   

 // db.crop.insert([{ph_min:45, ph_max:75, n:200, p:18, k:050, ca:05, mg:12, crop "Peanut"},{ph_min:45, ph_max:6,  n:170, p:22, k:220, ca:30, mg:28, crop "Potato"},{ph_min:55, ph_max:75, n:142, p:24, k:105, ca:57, mg:39, crop "Garlic"},{ph_min:6,  ph_max:7,  n:155, p:60, k:132, ca:52, mg:20, crop "Onion"},{ph_min:55, ph_max:65, n:135, p:16, k:110, ca:90, mg:12, crop "Orange"},{ph_min:58, ph_max:7,  n:125, p:20, k:105, ca:45, mg:37, crop "Peas"},{ph_min:55, ph_max:65, n:217, p:68, k:256, ca:27, mg:23, crop "Rice"},{ph_min:55, ph_max:75, n:136, p:24, k:192, ca:95, mg:22, crop "Tomato"},{ph_min:52, ph_max:62, n:125, p:24, k:035, ca:35, mg:10, crop "Wheat"},{ph_min:58, ph_max:68, n:100, p:70, k:230, ca:40, mg:30, crop "corn"},{ph_min:57, ph_max:67, n:200, p:50, k:240, ca:23, mg:20, crop "barley"},{ph_min:59, ph_max:69, n:227, p:73, k:267, ca:32, mg:30, crop "soyabeans"},{ph_min:51, ph_max:61, n:230, p:73, k:274, ca:37, mg:33, crop "Mustard"},{ph_min:50, ph_max:60, n:190, p:45, k:212, ca:52, mg:22, crop "Sugarcane"}])