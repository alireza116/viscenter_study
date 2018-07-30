var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

 var url = 'mongodb://viscenter:anchoring2019@ds051831.mlab.com:51831/anchoring';

 router.post('/api/mapresponse',function(req,res){
     let data = req.body;

     MongoClient.connect(url,{ useNewUrlParser: true },function(err,client){
         let db = client.db("anchoring");
         let col = db.collection('mapresponse');
         console.log(col);
         col.insert(data,function(err,docs){
             if (err){
                 res.send(err)
             } else {
                 res.send(docs);
             }
         })
     })
 })

 module.exports = router;